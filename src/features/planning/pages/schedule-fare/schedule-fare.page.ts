/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, filter, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import {
  defaultPlaceValue,
  localDatetimeString,
  RegularPresentation,
  toJourney,
  toLocalDatetimeString,
  toRegularPresentation
} from '../../common/fares.presenter';
import { SCHEDULE_FARE_ACTION, ScheduleFareAction } from '../../providers';
import { SCHEDULE_FARE_FORM, ScheduleFareFields, setScheduleFareErrorToForm } from './schedule-fare.form';
import { formatScheduleFareError, toFareToSchedule, toScheduleFareSuccessToast } from './schedule-fare.presenter';
import { Driver, DurationDistance, Entity, FaresScheduled, isValidPlace, JourneyEstimate } from '@definitions';
import { DailyPlanningLayout } from '../../layouts';
import { SlotContext } from '../../components/planning/planning-row/planning-row.component';
import { DailyDriverPlanning } from '../../common/fares.presentation';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { ActivatedRoute, Router } from '@angular/router';

import { EstimateJourneyValues } from '../../components';
import { toDisplayDurationDistance } from '../../common/unit-convertion';
import {
  bootstrapValidationClasses,
  BootstrapValidationClasses,
  forceControlRevalidation,
  nullToUndefined
} from '@features/common/form-validation';
import { ESTIMATE_JOURNEY_QUERY, EstimateJourneyQuery } from '@features/common/journey';
import { PlaceValues } from '@features/common/place';
import { DestinationValues } from '@features/common/destination';
import { DriverValues } from '@features/common/driver';
import { toDriversValues } from '../../../common/driver/driver.presenter';
import { regularHasId, RegularValues } from '@features/common/regular';

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
  private readonly _regular$: Subject<Entity & RegularValues> = new Subject<Entity & RegularValues>();

  public drivers$: Observable<DriverValues[]> = this._planning.drivers$.pipe(map(toDriversValues));

  public onSelectRegularChange(regular: Entity & RegularValues): void {
    this._regular$.next(regular);
  }

  public regular$: Observable<RegularPresentation> = this._regular$.asObservable().pipe(map(toRegularPresentation));

  public validRegular$: Observable<boolean> = this._regular$
    .asObservable()
    .pipe(map((regular: Entity & RegularValues): boolean => regularHasId(regular)));

  // TODO Refactor estimate field by passing the formcontrols ?
  private readonly _departure$: BehaviorSubject<PlaceValues> = new BehaviorSubject<PlaceValues>(defaultPlaceValue);
  private readonly _destination$: BehaviorSubject<PlaceValues> = new BehaviorSubject<PlaceValues>(defaultPlaceValue);

  public updateEstimateFields($event: Record<keyof EstimateJourneyValues, FormControl<number>>): void {
    this.scheduleFareForm.controls.driveDuration = $event.driveDuration;
    this.scheduleFareForm.controls.driveDistance = $event.driveDistance;
  }

  public onDepartureSelectedValueChange(place: PlaceValues): void {
    this._departure$.next(place);
  }

  public onDestinationSelectedValueChange(destinationValues: DestinationValues): void {
    this._destination$.next(destinationValues.place);

    if (destinationValues.isTwoWayDrive !== undefined)
      this.scheduleFareForm.controls.isTwoWayDrive.setValue(destinationValues.isTwoWayDrive);

    if (destinationValues.isMedicalDrive !== undefined)
      this.scheduleFareForm.controls.isMedicalDrive.setValue(destinationValues.isMedicalDrive);
  }
  public onSelectDriverChange(driver: Driver & Entity): void {
    this.scheduleFareForm.controls.driver.setValue(driver);
  }
  public readonly estimateJourney$: Observable<DurationDistance> = combineLatest([this._departure$, this._destination$]).pipe(
    filter(
      ([departure, destination]: [PlaceValues, PlaceValues]): boolean => isValidPlace(departure) && isValidPlace(destination)
    ),
    switchMap(
      (): Observable<JourneyEstimate> => this._estimateJourneyQuery$(toJourney(nullToUndefined(this.scheduleFareForm.value)))
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
    this._toaster.toast({
      content: `Échec de la planification de la course: ${error.name} | ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };
}
