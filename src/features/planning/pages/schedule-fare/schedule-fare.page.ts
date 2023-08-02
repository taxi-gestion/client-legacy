import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClientPresentation } from '@features/common/client';
import { isValidPlace, Place, PlacePresentation } from '@features/common/place';
import { PredictedRecurrence } from '@features/common/recurrence';
import { UserPresentation } from '@features/common/user';
import { BehaviorSubject, combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { FareToSchedule, SCHEDULE_FARE_ACTION, ScheduleFareAction } from '../../providers';
import { SCHEDULE_FARE_FORM, ScheduleFareFields, setScheduleFareErrorToForm } from './schedule-fare.form';
import { formatScheduleFareError, toFareToScheduleTransfer } from './schedule-fare.presenter';
import { ESTIMATE_JOURNEY_QUERY, EstimateJourneyQuery, JourneyEstimate } from '@features/common/journey';
import { datetimeLocalToIso8601UTCString } from '../../common/unit-convertion';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule-fare.page.html'
})
export class ScheduleFarePage {
  @Output() public scheduleFareSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly scheduleFare$ = (): Observable<object> =>
    this._scheduleFareAction$(toFareToScheduleTransfer(SCHEDULE_FARE_FORM.value as FareToSchedule));

  public readonly scheduleFareForm: FormGroup<ScheduleFareFields> = SCHEDULE_FARE_FORM;
  private readonly _departure: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);
  private readonly _destination: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);
  public readonly estimateJourney$: Observable<JourneyEstimate> = combineLatest([this._departure, this._destination]).pipe(
    filter(([departure, destination]: [Place, Place]): boolean => isValidPlace(departure) && isValidPlace(destination)),
    switchMap(
      ([departure, destination]: [Place, Place]): Observable<JourneyEstimate> =>
        this._estimateJourneyQuery$({
          departure,
          destination,
          departureTime: datetimeLocalToIso8601UTCString(SCHEDULE_FARE_FORM.controls.datetime.value as string)
        })
    ),
    tap((estimate: JourneyEstimate): void => this.onJourneyEstimateReceived(estimate))
  );

  public onSelectDepartureChange(place: PlacePresentation): void {
    this.scheduleFareForm.controls.driveFrom.setValue(place);
    this._departure.next(place);
  }

  public onSelectDestinationChange(place: PlacePresentation): void {
    this.scheduleFareForm.controls.driveTo.setValue(place);
    this._destination.next(place);
  }

  public onSelectDriverChange(driver: UserPresentation): void {
    this.scheduleFareForm.controls.planning.setValue(driver.identifier);
  }

  public onSelectClientChange(client: ClientPresentation): void {
    this.scheduleFareForm.controls.clientIdentity.setValue(`${client.lastname} ${client.firstname}`);
    this.scheduleFareForm.controls.clientPhone.setValue(`${client.phone}`);
  }

  public onJourneyEstimateReceived(estimate: JourneyEstimate): void {
    this.scheduleFareForm.controls.duration.setValue(estimate.durationInSeconds);
    this.scheduleFareForm.controls.distance.setValue(estimate.distanceInMeters);
  }

  public onSearchClientTermChange(search: string): void {
    this.scheduleFareForm.controls.clientIdentity.setValue(search);
  }

  public constructor(
    @Inject(SCHEDULE_FARE_ACTION) private readonly _scheduleFareAction$: ScheduleFareAction,
    @Inject(ESTIMATE_JOURNEY_QUERY) private readonly _estimateJourneyQuery$: EstimateJourneyQuery
  ) {}

  public onSubmitFareToSchedule = (triggerAction: () => void): void => {
    SCHEDULE_FARE_FORM.markAllAsTouched();
    SCHEDULE_FARE_FORM.valid && triggerAction();
  };

  public onPredictRecurrenceSuccessChange = (predictedRecurrence: PredictedRecurrence): void => {
    this.scheduleFareForm.controls.recurrence.setValue(predictedRecurrence);
  };

  public onScheduleFareActionSuccess = (): void => {
    SCHEDULE_FARE_FORM.reset();
  };

  public onScheduleFareActionError = (error: Error): void => {
    setScheduleFareErrorToForm(formatScheduleFareError(error));
  };
}
