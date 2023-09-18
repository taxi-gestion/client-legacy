/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, filter, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { defaultPlaceValue, localDatetimeString, toJourney, toLocalDatetimeString } from '../../common/fares.presenter';
import { SCHEDULE_FARE_ACTION, ScheduleFareAction } from '../../providers';
import { FareToScheduleValues, SCHEDULE_FARE_FORM, ScheduleFareFields, setScheduleFareErrorToForm } from './schedule-fare.form';
import {
  formatScheduleFareError,
  toFareToSchedule,
  toFirstDestination,
  toFirstPhone,
  toScheduleFareSuccessToast,
  updateRegularLinkedControls
} from './schedule-fare.presenter';
import {
  Driver,
  DurationDistance,
  Entity,
  FaresScheduled,
  isValidPlace,
  JourneyEstimate,
  Place,
  RegularDetails
} from '@definitions';
import { DailyPlanningLayout } from '../../layouts';
import { SlotContext } from '../../components/planning/planning-row/planning-row.component';
import { DailyDriverPlanning } from '../../common/fares.presentation';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { ActivatedRoute, Router } from '@angular/router';
import {
  bootstrapValidationClasses,
  BootstrapValidationClasses,
  ESTIMATE_JOURNEY_QUERY,
  EstimateJourneyQuery,
  forceControlRevalidation,
  nullToUndefined
} from '@features/common';
import { DestinationValues, EstimateJourneyValues } from '../../components';
import { toDisplayDurationDistance } from '../../common/unit-convertion';
import { PhoneValues } from '../../components/regular/phones/phones.component';

type RegularInitialValues = {
  phone: PhoneValues | undefined;
  destination: DestinationValues | undefined;
  departure: Place | undefined;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule-fare.page.html'
})
export class ScheduleFarePage {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Output() public scheduleFareSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly scheduleFareForm: FormGroup<ScheduleFareFields> = SCHEDULE_FARE_FORM;

  public readonly scheduleFare$ = (): Observable<FaresScheduled> =>
    this._scheduleFareAction$(toFareToSchedule(nullToUndefined(this.scheduleFareForm.value)));

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _planning: DailyPlanningLayout,
    @Inject(SCHEDULE_FARE_ACTION) private readonly _scheduleFareAction$: ScheduleFareAction,
    @Inject(ESTIMATE_JOURNEY_QUERY) private readonly _estimateJourneyQuery$: EstimateJourneyQuery
  ) {}

  //region form-bindings
  private readonly _regular$: Subject<Entity & RegularDetails> = new Subject<Entity & RegularDetails>();

  public onSelectRegularChange(regular: Entity & RegularDetails): void {
    this._regular$.next(regular);
    this.scheduleFareForm.controls.passenger.setValue(regular);
  }

  public regular$: Observable<RegularInitialValues> = this._regular$.asObservable().pipe(
    tap(updateRegularLinkedControls(this.scheduleFareForm)),
    map(
      (regular: Entity & RegularDetails): RegularInitialValues => ({
        phone: toFirstPhone(regular),
        destination: toFirstDestination(regular),
        departure: regular.home
      })
    ),
    // TODO This may probably be improved
    tap((regularInitialValues: RegularInitialValues): void => {
      this._departure$.next(regularInitialValues.departure ?? defaultPlaceValue);
      this._destination$.next(regularInitialValues.destination?.place ?? defaultPlaceValue);
    })
  );

  private readonly _departure$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);
  private readonly _destination$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  public updateEstimateFields($event: Record<keyof EstimateJourneyValues, FormControl<number>>): void {
    this.scheduleFareForm.controls.driveDuration = $event.driveDuration;
    this.scheduleFareForm.controls.driveDistance = $event.driveDistance;
  }

  public onSelectDepartureChange(place: Place): void {
    this.scheduleFareForm.controls.departurePlace.setValue(place);
    this._departure$.next(place);
  }

  public onSelectArrivalChange(place: Place): void {
    this.scheduleFareForm.controls.arrivalPlace.setValue(place);
    this._destination$.next(place);
  }

  public onSelectDriverChange(driver: Driver & Entity): void {
    this.scheduleFareForm.controls.driver.setValue(driver);
  }
  public readonly estimateJourney$: Observable<DurationDistance> = combineLatest([this._departure$, this._destination$]).pipe(
    filter(([departure, destination]: [Place, Place]): boolean => isValidPlace(departure) && isValidPlace(destination)),
    switchMap(
      (): Observable<JourneyEstimate> =>
        // TODO Remove as
        this._estimateJourneyQuery$(toJourney(nullToUndefined(this.scheduleFareForm.value) as FareToScheduleValues))
    ),
    map(toDisplayDurationDistance)
  );
  //endregion

  //region planning-binding
  public selectedSlotContext$: Observable<SlotContext<DailyDriverPlanning>> = this._planning.selectedSlotContext$.pipe(
    filter(Boolean),
    tap((context: SlotContext<DailyDriverPlanning>): void => this.updateLinkedFields(context))
  );

  public selectedDateContext$: Observable<string> = of(localDatetimeString()).pipe(
    tap((localDateString: string): void => this.scheduleFareForm.controls.departureDatetime.setValue(localDateString)),
    switchMap(
      (): Observable<string> =>
        combineLatest([this._planning.planningDay$, this.selectedSlotContext$]).pipe(
          map(([dateString, context]: [dateString: string, context: SlotContext<DailyDriverPlanning>]): string =>
            toLocalDatetimeString(dateString, context.startTimeInMinutes)
          ),
          tap((localDateString: string): void => this.scheduleFareForm.controls.departureDatetime.setValue(localDateString))
        )
    )
  );

  public updateLinkedFields(context: SlotContext<DailyDriverPlanning>): void {
    this.scheduleFareForm.controls.driver.setValue(context.rowContext.driver);
  }
  //endregion

  //region

  //region action schedule fare
  public onSubmitFareToSchedule = (triggerAction: () => void): void => {
    this.scheduleFareForm.markAllAsTouched();
    this.scheduleFareForm.valid ? triggerAction() : forceControlRevalidation(this.scheduleFareForm);
  };

  public onScheduleFareActionSuccess = async (fares: FaresScheduled): Promise<void> => {
    this.scheduleFareForm.reset();
    this._toaster.toast(toScheduleFareSuccessToast(fares));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onScheduleFareActionError = (error: Error): void => {
    setScheduleFareErrorToForm(formatScheduleFareError(error));
    this._toaster.toast({ content: 'Échec de la planification de la course', status: 'danger', title: 'Opération échouée' });
  };
  //endregion
}
