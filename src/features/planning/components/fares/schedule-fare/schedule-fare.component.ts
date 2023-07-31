import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FareToScheduleTransfer, SCHEDULE_FARE_ACTION, ScheduleFareAction } from '../../../providers';
import { SCHEDULE_FARE_FORM, ScheduleFareFields, setScheduleFareErrorToForm } from './schedule-fare.form';
import { formatScheduleFareError, toFareToScheduleTransfer } from './schedule-fare.presenter';
import {
  ESTIMATE_JOURNEY_QUERY,
  EstimateJourneyQuery,
  isValidPlace,
  JourneyEstimate,
  Place,
  PlacePresentation
} from '@features/place';
import { PredictedRecurrence } from '@features/recurrence';
import { UserPresentation } from '@features/user';
import { ClientPresentation } from '@features/client';
import { defaultPlaceValue } from '../../../common/fares.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-schedule-fare',
  templateUrl: './schedule-fare.component.html'
})
export class ScheduleFareComponent {
  @Output() public scheduleFareSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly scheduleFare$ = (): Observable<object> =>
    this._scheduleFareAction$(toFareToScheduleTransfer(SCHEDULE_FARE_FORM.value as FareToScheduleTransfer));

  public readonly scheduleFareForm: FormGroup<ScheduleFareFields> = SCHEDULE_FARE_FORM;
  private readonly _departure: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);
  private readonly _destination: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);
  public readonly estimateJourney$: Observable<JourneyEstimate> = combineLatest([this._departure, this._destination]).pipe(
    filter(([departure, destination]: [Place, Place]): boolean => isValidPlace(departure) && isValidPlace(destination)),
    switchMap(
      ([departure, destination]: [Place, Place]): Observable<JourneyEstimate> =>
        this._estimateJourneyQuery$({ departure, destination })
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
    this.scheduleFareForm.controls.duration.setValue(estimate.duration.valueInSeconds);
    this.scheduleFareForm.controls.distance.setValue(estimate.distance.valueInMeters);
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
