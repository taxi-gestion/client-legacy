import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { defaultPlaceValue, toJourney, toLocalDatetimeString } from '../../common/fares.presenter';
import { SCHEDULE_FARE_ACTION, ScheduleFareAction } from '../../providers';
import {
  FareToSchedulePresentation,
  SCHEDULE_FARE_FORM,
  ScheduleFareFields,
  setScheduleFareErrorToForm
} from './schedule-fare.form';
import { formatScheduleFareError, toFareToSchedule, toScheduleFareSuccessToast } from './schedule-fare.presenter';
import { ESTIMATE_JOURNEY_QUERY, EstimateJourneyQuery } from '@features/common/journey';
import { Driver, DurationDistance, FaresScheduled, isValidPlace, JourneyEstimate, Place, RegularDetails } from '@definitions';
import { toDisplayDurationDistance } from '../../common/unit-convertion';
import { DailyPlanningLayout } from '../../layouts';
import { SlotContext } from '../../components/planning/planning-row/planning-row.component';
import { DailyDriverPlanning } from '../../common/fares.presentation';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { ActivatedRoute, Router } from '@angular/router';
import { EstimateJourneyValues } from '../../components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule-fare.page.html'
})
export class ScheduleFarePage {
  @Output() public scheduleFareSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly scheduleFare$ = (): Observable<FaresScheduled> =>
    // TODO Had to use SCHEDULE_FARE_FORM.getRawValue() instead of SCHEDULE_FARE_FORM.value for the latest controls value to be retreived
    this._scheduleFareAction$(toFareToSchedule(SCHEDULE_FARE_FORM.getRawValue() as FareToSchedulePresentation));

  public readonly scheduleFareForm: FormGroup<ScheduleFareFields> = SCHEDULE_FARE_FORM;

  private readonly _departure$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  private readonly _destination$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  //region estimateJourney
  public readonly estimateJourney$: Observable<DurationDistance> = combineLatest([this._departure$, this._destination$]).pipe(
    filter(([departure, destination]: [Place, Place]): boolean => isValidPlace(departure) && isValidPlace(destination)),
    switchMap(
      (): Observable<JourneyEstimate> =>
        this._estimateJourneyQuery$(toJourney(SCHEDULE_FARE_FORM.getRawValue() as FareToSchedulePresentation))
    ),
    map(toDisplayDurationDistance)
  );

  public updateEstimateFields($event: Record<keyof EstimateJourneyValues, FormControl<number>>): void {
    this.scheduleFareForm.controls.driveDuration = $event.driveDuration;
    this.scheduleFareForm.controls.driveDistance = $event.driveDistance;
  }
  //endregion

  public onSelectDepartureChange(place: Place): void {
    this.scheduleFareForm.controls.departurePlace.setValue(place);
    this._departure$.next(place);
  }

  public onSelectArrivalChange(place: Place): void {
    this.scheduleFareForm.controls.arrivalPlace.setValue(place);
    this._destination$.next(place);
  }

  public onSelectDriverChange(driver: Driver): void {
    this.scheduleFareForm.controls.driver.setValue(driver.identifier);
  }

  public onSelectRegularChange(regular: RegularDetails): void {
    this.scheduleFareForm.controls.passenger.setValue(`${regular.lastname} ${regular.firstname}`);
    this.scheduleFareForm.controls.phoneToCall.setValue(regular.phones?.[0]?.number ?? '');
    // TODO Finish autofill
  }

  public onSearchRegularTermChange(search: string): void {
    this.scheduleFareForm.controls.passenger.setValue(search);
  }

  public selectedSlotContext$: Observable<SlotContext<DailyDriverPlanning>> = this._planning.selectedSlotContext$.pipe(
    filter(Boolean),
    tap((context: SlotContext<DailyDriverPlanning>): void => this.updateLinkedFields(context))
  );

  public selectedDateContext$: Observable<string> = combineLatest([
    this._planning.planningDay$,
    this.selectedSlotContext$
  ]).pipe(
    map(([dateString, context]: [dateString: string, context: SlotContext<DailyDriverPlanning>]): string =>
      toLocalDatetimeString(dateString, context.startTimeInMinutes)
    ),
    tap((localDateString: string): void => this.scheduleFareForm.controls.departureDatetime.setValue(localDateString))
  );

  public updateLinkedFields(context: SlotContext<DailyDriverPlanning>): void {
    this.scheduleFareForm.controls.driver.setValue(context.rowContext.driver.identifier);
  }

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _planning: DailyPlanningLayout,
    @Inject(SCHEDULE_FARE_ACTION) private readonly _scheduleFareAction$: ScheduleFareAction,
    @Inject(ESTIMATE_JOURNEY_QUERY) private readonly _estimateJourneyQuery$: EstimateJourneyQuery
  ) {}

  public onSubmitFareToSchedule = (triggerAction: () => void): void => {
    SCHEDULE_FARE_FORM.markAllAsTouched();
    SCHEDULE_FARE_FORM.valid && triggerAction();
  };

  public onScheduleFareActionSuccess = async (fares: FaresScheduled): Promise<void> => {
    SCHEDULE_FARE_FORM.reset();
    // TODO Type action and modify returned payload
    this._toaster.toast(toScheduleFareSuccessToast(fares));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onScheduleFareActionError = (error: Error): void => {
    setScheduleFareErrorToForm(formatScheduleFareError(error));
    this._toaster.toast({ content: 'Échec de la planification de la course', status: 'danger', title: 'Opération échouée' });
  };
}
