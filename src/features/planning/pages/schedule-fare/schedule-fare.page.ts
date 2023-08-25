import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { SCHEDULE_FARE_ACTION, ScheduleFareAction } from '../../providers';
import {
  FareToSchedulePresentation,
  SCHEDULE_FARE_FORM,
  ScheduleFareFields,
  setScheduleFareErrorToForm
} from './schedule-fare.form';
import { formatScheduleFareError, toFareToSchedule, toJourney, toLocalDatetimeString } from './schedule-fare.presenter';
import { ESTIMATE_JOURNEY_QUERY, EstimateJourneyQuery } from '@features/common/journey';
import { Driver, DurationDistance, isValidPlace, JourneyEstimate, Passenger, Place } from '@domain';
import { toDisplayDurationDistance } from '../../common/unit-convertion';
import { DailyPlanningLayout } from '../../layouts';
import { SlotContext } from '../../components/planning/planning-row/planning-row.component';
import { DailyDriverPlanning } from '../../common/fares.presentation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule-fare.page.html'
})
export class ScheduleFarePage {
  @Output() public scheduleFareSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly scheduleFare$ = (): Observable<object> =>
    this._scheduleFareAction$(toFareToSchedule(SCHEDULE_FARE_FORM.value as FareToSchedulePresentation));

  public readonly scheduleFareForm: FormGroup<ScheduleFareFields> = SCHEDULE_FARE_FORM;

  private readonly _departure: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  private readonly _destination: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  public readonly estimateJourney$: Observable<DurationDistance> = combineLatest([this._departure, this._destination]).pipe(
    filter(([departure, destination]: [Place, Place]): boolean => isValidPlace(departure) && isValidPlace(destination)),
    switchMap(
      (): Observable<JourneyEstimate> =>
        this._estimateJourneyQuery$(toJourney(SCHEDULE_FARE_FORM.value as FareToSchedulePresentation))
    ),
    map(toDisplayDurationDistance),
    tap((estimate: DurationDistance): void => this.onJourneyEstimateReceived(estimate))
  );

  public onSelectDepartureChange(place: Place): void {
    this.scheduleFareForm.controls.departurePlace.setValue(place);
    this._departure.next(place);
  }

  public onSelectArrivalChange(place: Place): void {
    this.scheduleFareForm.controls.arrivalPlace.setValue(place);
    this._destination.next(place);
  }

  public onSelectDriverChange(driver: Driver): void {
    this.scheduleFareForm.controls.driver.setValue(driver.identifier);
  }

  public onSelectPassengerChange(passenger: Passenger): void {
    this.scheduleFareForm.controls.passenger.setValue(passenger.passenger);
    this.scheduleFareForm.controls.phoneToCall.setValue(passenger.phone);
  }

  public onJourneyEstimateReceived(durationDistance: DurationDistance): void {
    this.scheduleFareForm.controls.driveDuration.setValue(durationDistance.duration);
    this.scheduleFareForm.controls.driveDistance.setValue(durationDistance.distance);
  }

  public onSearchPassengerTermChange(search: string): void {
    this.scheduleFareForm.controls.passenger.setValue(search);
  }

  public selectedSlotContext$: Observable<SlotContext<DailyDriverPlanning>> = this._planning.selectedSlotContext$.pipe(
    filter(Boolean),
    tap((context: SlotContext<DailyDriverPlanning>): void => this.updateLinkedFields(context))
  );

  public updateLinkedFields(context: SlotContext<DailyDriverPlanning>): void {
    this.scheduleFareForm.controls.departureDatetime.setValue(
      toLocalDatetimeString(this._planning.planningDay, context.startTimeInMinutes)
    );
    this.scheduleFareForm.controls.driver.setValue(context.rowContext.driver.identifier);
  }

  public constructor(
    private readonly _planning: DailyPlanningLayout,
    @Inject(SCHEDULE_FARE_ACTION) private readonly _scheduleFareAction$: ScheduleFareAction,
    @Inject(ESTIMATE_JOURNEY_QUERY) private readonly _estimateJourneyQuery$: EstimateJourneyQuery
  ) {}

  public onSubmitFareToSchedule = (triggerAction: () => void): void => {
    SCHEDULE_FARE_FORM.markAllAsTouched();
    SCHEDULE_FARE_FORM.valid && triggerAction();
  };

  public onScheduleFareActionSuccess = (): void => {
    SCHEDULE_FARE_FORM.reset();
  };

  public onScheduleFareActionError = (error: Error): void => {
    setScheduleFareErrorToForm(formatScheduleFareError(error));
  };
}
