import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { SCHEDULE_FARE_ACTION, ScheduleFareAction } from '../../providers';
import {
  FareToSchedulePresentation,
  SCHEDULE_FARE_FORM,
  ScheduleFareFields,
  setScheduleFareErrorToForm
} from './schedule-fare.form';
import { formatScheduleFareError, toFareToSchedule, toJourney } from './schedule-fare.presenter';
import { ESTIMATE_JOURNEY_QUERY, EstimateJourneyQuery } from '@features/common/journey';
import { Driver, isValidPlace, JourneyEstimate, Passenger, Place } from '@domain';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns-tz';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule-fare.page.html'
})
export class ScheduleFarePage /*implements OnInit*/ {
  @Output() public scheduleFareSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly scheduleFare$ = (): Observable<object> =>
    this._scheduleFareAction$(toFareToSchedule(SCHEDULE_FARE_FORM.value as FareToSchedulePresentation));

  public readonly scheduleFareForm: FormGroup<ScheduleFareFields> = SCHEDULE_FARE_FORM;

  private readonly _departure: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  private readonly _destination: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  public readonly estimateJourney$: Observable<JourneyEstimate> = combineLatest([this._departure, this._destination]).pipe(
    filter(([departure, destination]: [Place, Place]): boolean => isValidPlace(departure) && isValidPlace(destination)),
    switchMap(
      (): Observable<JourneyEstimate> =>
        this._estimateJourneyQuery$(toJourney(SCHEDULE_FARE_FORM.value as FareToSchedulePresentation))
    ),
    tap((estimate: JourneyEstimate): void => this.onJourneyEstimateReceived(estimate))
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

  public onJourneyEstimateReceived(estimate: JourneyEstimate): void {
    this.scheduleFareForm.controls.driveDuration.setValue(estimate.durationInSeconds);
    this.scheduleFareForm.controls.driveDistance.setValue(estimate.distanceInMeters);
  }

  public onSearchPassengerTermChange(search: string): void {
    this.scheduleFareForm.controls.passenger.setValue(search);
  }

  public defaultDriver: string = '';

  // eslint-disable-next-line max-statements
  public constructor(
    private readonly _route: ActivatedRoute,
    @Inject(SCHEDULE_FARE_ACTION) private readonly _scheduleFareAction$: ScheduleFareAction,
    @Inject(ESTIMATE_JOURNEY_QUERY) private readonly _estimateJourneyQuery$: EstimateJourneyQuery
  ) {
    const dateString: string | null = this._route.snapshot.paramMap.get('date') ?? format(new Date(), 'yyyy-MM-dd');
    const timeInMinutes: number = Number(this._route.snapshot.paramMap.get('timeInMinutes'));
    const driver: string | null = this._route.snapshot.paramMap.get('driver');
    //const initialValue: string = dateString === null ? new Date() : new Date(`${dateString}`)

    const date: Date = new Date(dateString);
    date.setHours(timeInMinutes / 60, timeInMinutes % 60);
    this.scheduleFareForm.controls.departureDatetime.setValue(`${format(date, 'yyyy-MM-dd')}T${format(date, 'HH:mm')}`);

    if (driver != null) {
      this.scheduleFareForm.controls.driver.setValue(driver);
      this.defaultDriver = driver;
    }
  }

  public onSubmitFareToSchedule = (triggerAction: () => void): void => {
    SCHEDULE_FARE_FORM.markAllAsTouched();
    SCHEDULE_FARE_FORM.valid && triggerAction();
  };

  /*  public onPredictRecurrenceSuccessChange = (predictedRecurrence: PredictedRecurrence): void => {
    this.scheduleFareForm.controls.recurrence.setValue(predictedRecurrence);
  };*/

  public onScheduleFareActionSuccess = (): void => {
    SCHEDULE_FARE_FORM.reset();
  };

  public onScheduleFareActionError = (error: Error): void => {
    setScheduleFareErrorToForm(formatScheduleFareError(error));
  };
}
