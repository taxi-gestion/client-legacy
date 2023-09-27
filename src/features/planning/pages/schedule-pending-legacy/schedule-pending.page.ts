/*
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { SCHEDULE_RETURN_ACTION, SchedulePendingAction } from '../../providers';
import { SCHEDULE_RETURN_FORM, SchedulePendingFields, setSchedulePendingErrorToForm } from './schedule-pending.form';
import {
  formatSchedulePendingError,
  nowOrLater,
  toReturnToSchedule,
  toSchedulePendingSuccessToast
} from './schedule-pending.presenter';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDateToDatetimeLocalString, toDisplayDurationDistance } from '../../common/unit-convertion';
import { Driver, DurationDistance, isValidPlace, JourneyEstimate, PendingScheduled, Place } from '@definitions';
import { PendingPresentation } from '../../common';
import { defaultPlaceValue, toJourney } from '../../common/fares.presenter';
import { ESTIMATE_JOURNEY_QUERY, EstimateJourneyQuery } from '@features/common/journey';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { EstimateJourneyValues } from '../../components';
import { DailyPlanningLayout } from '../../layouts';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-schedule-pending',
  templateUrl: './schedule-pending.page.html'
})
export class SchedulePendingPage {
  @Output() public schedulePendingSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public schedulePendingSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public schedulePendingError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly schedulePending$ = (): Observable<PendingScheduled> =>
    // TODO Had to use SCHEDULE_FARE_FORM.getRawValue() instead of SCHEDULE_FARE_FORM.value for the latest controls value to be retreived
    this._schedulePendingAction$(toReturnToSchedule(SCHEDULE_RETURN_FORM.getRawValue() as PendingPresentation));

  public readonly schedulePendingForm: FormGroup<SchedulePendingFields> = SCHEDULE_RETURN_FORM;

  private readonly _departure$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  public departure$: Observable<Place> = this._departure$.asObservable();

  private readonly _destination$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);
  public destination$: Observable<Place> = this._destination$.asObservable();

  //private readonly _driverDisplay$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  //public driverDisplay$: Observable<string> = this._driverDisplay$.asObservable();

  public readonly estimateJourney$: Observable<DurationDistance> = combineLatest([this._departure$, this._destination$]).pipe(
    filter(([departure, destination]: [Place, Place]): boolean => isValidPlace(departure) && isValidPlace(destination)),
    switchMap(
      (): Observable<JourneyEstimate> =>
        this._estimateJourneyQuery$(toJourney(SCHEDULE_RETURN_FORM.getRawValue() as PendingPresentation))
    ),
    map(toDisplayDurationDistance)
  );

  public planningDay$: Observable<string> = this._planning.planningDay$.pipe(
    tap((dayString: string): void =>
      this.schedulePendingForm.controls.departureDatetime.setValue(formatDateToDatetimeLocalString(nowOrLater(dayString)))
    )
  );

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _planning: DailyPlanningLayout,
    @Inject(SCHEDULE_RETURN_ACTION) private readonly _schedulePendingAction$: SchedulePendingAction,
    @Inject(ESTIMATE_JOURNEY_QUERY) private readonly _estimateJourneyQuery$: EstimateJourneyQuery
  ) {}

  public onSelectPendingReturnChange(pendingReturn: PendingPresentation): void {
    this.schedulePendingForm.controls.pendingReturnId.setValue(pendingReturn.pendingReturnId);
    this.onSelectDepartureChange(pendingReturn.departurePlace);
    this.onSelectArrivalChange(pendingReturn.arrivalPlace);
    this.onSelectDriverChange(pendingReturn.driver);
  }

  public onSelectDepartureChange(place: Place): void {
    this.schedulePendingForm.controls.departurePlace.setValue(place);
    this._departure$.next(place);
  }

  public onSelectArrivalChange(place: Place): void {
    this.schedulePendingForm.controls.arrivalPlace.setValue(place);
    this._destination$.next(place);
  }

  public onSelectDriverChange(driver: Driver): void {
    this.schedulePendingForm.controls.driver.setValue(driver);
  }

  public onSubmitReturnToSchedule = (triggerAction: () => void): void => {
    SCHEDULE_RETURN_FORM.markAllAsTouched();
    SCHEDULE_RETURN_FORM.valid && triggerAction();
  };

  public onSchedulePendingActionSuccess = async (pending: PendingScheduled): Promise<void> => {
    SCHEDULE_RETURN_FORM.reset();
    this._toaster.toast(toSchedulePendingSuccessToast(pending));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onSchedulePendingActionError = (error: Error): void => {
    setSchedulePendingErrorToForm(formatSchedulePendingError(error));
    this._toaster.toast({ content: 'Échec de la planification du retour', status: 'danger', title: 'Opération échouée' });
  };

  public updateEstimateFields($event: Record<keyof EstimateJourneyValues, FormControl<number>>): void {
    this.schedulePendingForm.controls.driveDuration = $event.driveDuration;
    this.schedulePendingForm.controls.driveDistance = $event.driveDistance;
  }
}
*/
