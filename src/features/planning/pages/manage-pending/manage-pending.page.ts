/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import {
  PENDING_RETURNS_FOR_DATE_QUERY,
  PendingReturnsForDateQuery,
  SCHEDULE_PENDING_ACTION,
  SchedulePendingAction
} from '../../providers';
import { DailyPlanningLayout } from '../../layouts';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DurationDistance,
  Entity,
  isValidPlace,
  JourneyEstimate,
  Pending,
  PendingScheduled,
  Place,
  RegularDetails
} from '@definitions';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { FormControl, FormGroup } from '@angular/forms';
import { formatDateToDatetimeLocalString, toDisplayDurationDistance } from '../../common/unit-convertion';
import { DriverValues, toDriversValues } from '@features/common/driver';
import { fareHasId, pendingReturnEmptyValue, PendingReturnValues, toPendingReturnsValues } from '@features/fare';
import { REGULAR_BY_ID_QUERY, RegularByIdQuery, RegularValues, toRegularValues } from '@features/common/regular';
import { forceControlRevalidation, nullToUndefined } from '@features/common/form-validation';
import {
  formatSchedulePendingError,
  nowOrLater,
  toJourney,
  toPendingToSchedule,
  toSchedulePendingSuccessToast
} from './schedule-pending.presenter';
import { SCHEDULE_PENDING_FORM, SchedulePendingFields, setSchedulePendingErrorToForm } from './schedule-pending.form';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { PlaceValues } from '@features/common/place';
import { ESTIMATE_JOURNEY_QUERY, EstimateJourneyQuery } from '@features/common/journey';
import { EstimateJourneyValues } from '../../components';

type PageData = {
  fare: PendingReturnValues;
  regularValues: Entity & RegularValues;
  drivers: DriverValues[];
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-pending.page.html'
})
export class ManagePendingPage {
  public readonly pendingReturns$: Observable<PendingReturnValues[]> = this._planning.planningDay$.pipe(
    switchMap((planningDay: string): Observable<(Entity & Pending)[]> => this._pendingForDateQuery(planningDay)),
    map(toPendingReturnsValues),
    catchError((error: Error): Observable<PendingReturnValues[]> => {
      this._toaster.toast({
        content: `Échec de la récupération des retours : ${error.name} | ${error.message}`,
        status: 'danger',
        title: 'Opération échouée'
      });
      return of([]);
    })
  );

  public fareControl: FormControl<PendingReturnValues> = new FormControl(pendingReturnEmptyValue, { nonNullable: true });

  private readonly _selectedPendingReturn$: Subject<PendingReturnValues> = new Subject<PendingReturnValues>();
  public selectedPendingReturn$: Observable<PendingReturnValues> = this._selectedPendingReturn$.asObservable();

  public onSelectPendingReturnChange(scheduled: PendingReturnValues): void {
    this._selectedPendingReturn$.next(scheduled);
  }

  public fare$: Observable<PendingReturnValues> = this.selectedPendingReturn$.pipe(
    tap((fare: PendingReturnValues): void => {
      if (fareHasId(fare))
        this.schedulePendingForm.controls.departureDatetime.setValue(
          formatDateToDatetimeLocalString(nowOrLater(fare.datetime))
        );
    })
  );

  public drivers$: Observable<DriverValues[]> = this._planning.drivers$.pipe(map(toDriversValues));

  public regularValues$: Observable<Entity & RegularValues> = this.selectedPendingReturn$.pipe(
    filter((fare: PendingReturnValues): boolean => fareHasId(fare)),
    switchMap((fare: PendingReturnValues): Observable<Entity & RegularDetails> => this._regularByIdQuery$(fare.passenger.id)),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map((regular: Entity & RegularDetails): Entity & RegularValues => toRegularValues(regular))
  );

  public readonly pageData$: Observable<PageData> = combineLatest([this.fare$, this.regularValues$, this.drivers$]).pipe(
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/typedef
    map(([fare, regularValues, drivers]) => ({
      fare,
      regularValues,
      drivers
    }))
  );

  public displayIfValidSelection(fare: PendingReturnValues): boolean {
    return fareHasId(fare);
  }

  private readonly _departure$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);
  private readonly _destination$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _planning: DailyPlanningLayout,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(PENDING_RETURNS_FOR_DATE_QUERY) private readonly _pendingForDateQuery: PendingReturnsForDateQuery,
    @Inject(REGULAR_BY_ID_QUERY) private readonly _regularByIdQuery$: RegularByIdQuery,
    @Inject(SCHEDULE_PENDING_ACTION) private readonly _schedulePendingAction$: SchedulePendingAction,
    @Inject(ESTIMATE_JOURNEY_QUERY) private readonly _estimateJourneyQuery$: EstimateJourneyQuery
  ) {}

  public readonly schedulePendingForm: FormGroup<SchedulePendingFields> = SCHEDULE_PENDING_FORM;

  //region edit
  public onDepartureSelectedValueChange(place: PlaceValues): void {
    this._departure$.next(place);
  }

  public onDestinationSelectedValueChange(place: PlaceValues): void {
    this._destination$.next(place);
  }

  public readonly schedulePending$ = (): Observable<PendingScheduled> =>
    this._schedulePendingAction$(
      toPendingToSchedule(nullToUndefined({ id: this.fareControl.value.id, ...this.schedulePendingForm.value }))
    );

  public onSubmitPendingToSchedule = (triggerAction: () => void): void => {
    this.schedulePendingForm.markAllAsTouched();
    this.schedulePendingForm.valid ? triggerAction() : forceControlRevalidation(this.schedulePendingForm);
  };

  public onSchedulePendingActionSuccess = async (fares: PendingScheduled): Promise<void> => {
    this.schedulePendingForm.reset();
    this._toaster.toast(toSchedulePendingSuccessToast(fares));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onSchedulePendingActionError = (error: Error): void => {
    setSchedulePendingErrorToForm(formatSchedulePendingError(error));
    this._toaster.toast({
      content: `Échec de la planification du retour: ${error.name} | ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };

  //region estimateJourney
  public readonly estimateJourney$: Observable<DurationDistance> = combineLatest([this._departure$, this._destination$]).pipe(
    filter(([departure, destination]: [Place, Place]): boolean => isValidPlace(departure) && isValidPlace(destination)),
    switchMap(
      (): Observable<JourneyEstimate> =>
        // TODO REFACTOR
        this._estimateJourneyQuery$(toJourney(this.schedulePendingForm.value))
    ),
    map(toDisplayDurationDistance)
  );

  public updateEstimateFields($event: Record<keyof EstimateJourneyValues, FormControl<number>>): void {
    this.schedulePendingForm.controls.driveDuration = $event.driveDuration;
    this.schedulePendingForm.controls.driveDistance = $event.driveDistance;
  }
}

// TODO Re add select fare on click ?
//public selectedSessionContext$: Observable<SessionContext<ScheduledPlanningSession, DailyDriverPlanning>> =
//  this._planning.selectedSessionContext$.pipe(filter(Boolean));
