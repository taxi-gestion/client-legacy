import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap } from 'rxjs';
import { SCHEDULE_RETURN_ACTION, ScheduleReturnAction } from '../../providers';
import { SCHEDULE_RETURN_FORM, ScheduleReturnFields, setScheduleReturnErrorToForm } from './schedule-return.form';
import { formatScheduleReturnError, toReturnToSchedule, toScheduleReturnSuccessToast } from './schedule-return.presenter';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { toDisplayDurationDistance, toStandardDateFormat } from '../../common/unit-convertion';
import { Driver, DurationDistance, Entity, isValidPlace, JourneyEstimate, Place, Scheduled } from '@domain';
import { PendingPresentation } from '../../common';
import { defaultPlaceValue, toJourney } from '../../common/fares.presenter';
import { ESTIMATE_JOURNEY_QUERY, EstimateJourneyQuery } from '@features/common';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { EstimateJourneyValues } from '../../components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-schedule-return',
  templateUrl: './schedule-return.page.html'
})
export class ScheduleReturnPage {
  @Output() public scheduleReturnSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleReturnSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleReturnError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly scheduleReturn$ = (): Observable<object> =>
    // TODO Had to use SCHEDULE_FARE_FORM.getRawValue() instead of SCHEDULE_FARE_FORM.value for the latest controls value to be retreived
    this._scheduleReturnAction$(toReturnToSchedule(SCHEDULE_RETURN_FORM.getRawValue() as PendingPresentation));

  public readonly scheduleReturnForm: FormGroup<ScheduleReturnFields> = SCHEDULE_RETURN_FORM;

  private readonly _departure: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  private readonly _destination: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  public readonly estimateJourney$: Observable<DurationDistance> = combineLatest([this._departure, this._destination]).pipe(
    filter(([departure, destination]: [Place, Place]): boolean => isValidPlace(departure) && isValidPlace(destination)),
    switchMap(
      (): Observable<JourneyEstimate> =>
        this._estimateJourneyQuery$(toJourney(SCHEDULE_RETURN_FORM.getRawValue() as PendingPresentation))
    ),
    map(toDisplayDurationDistance)
  );

  public selectedDate: string = paramsToDateString(this._route);

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(SCHEDULE_RETURN_ACTION) private readonly _scheduleReturnAction$: ScheduleReturnAction,
    @Inject(ESTIMATE_JOURNEY_QUERY) private readonly _estimateJourneyQuery$: EstimateJourneyQuery
  ) {}

  public onSelectDepartureChange(place: Place): void {
    this.scheduleReturnForm.controls.departurePlace.setValue(place);
    this._departure.next(place);
  }

  public onSelectArrivalChange(place: Place): void {
    this.scheduleReturnForm.controls.arrivalPlace.setValue(place);
    this._destination.next(place);
  }

  public onSelectDriverChange(driver: Driver): void {
    this.scheduleReturnForm.controls.driver.setValue(driver.identifier);
  }

  public onSelectPendingReturnChange(pendingReturn: PendingPresentation): void {
    this.scheduleReturnForm.controls.pendingReturnId.setValue(pendingReturn.pendingReturnId);
    this.onSelectDepartureChange(pendingReturn.departurePlace);
    this.onSelectArrivalChange(pendingReturn.arrivalPlace);
    // TODO Have full entity
    this.onSelectDriverChange({ identifier: pendingReturn.driver, username: pendingReturn.driver });
  }

  public onSubmitReturnToSchedule = (triggerAction: () => void): void => {
    SCHEDULE_RETURN_FORM.markAllAsTouched();
    SCHEDULE_RETURN_FORM.valid && triggerAction();
  };

  public onScheduleReturnActionSuccess = async (payload: unknown): Promise<void> => {
    SCHEDULE_RETURN_FORM.reset();
    this._toaster.toast(toScheduleReturnSuccessToast(payload as { rows: (Entity & Scheduled)[] }[]));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onScheduleReturnActionError = (error: Error): void => {
    setScheduleReturnErrorToForm(formatScheduleReturnError(error));
    this._toaster.toast({ content: 'Échec de la planification du retour', status: 'danger', title: 'Opération échouée' });
  };

  public updateEstimateFields($event: Record<keyof EstimateJourneyValues, FormControl<number>>): void {
    this.scheduleReturnForm.controls.driveDuration = $event.driveDuration;
    this.scheduleReturnForm.controls.driveDistance = $event.driveDistance;
  }
}

const paramsToDateString = (params: Params): string =>
  params['date'] == null ? toStandardDateFormat(new Date()) : (params['date'] as string);
