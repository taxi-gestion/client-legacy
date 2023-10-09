/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  DELETE_FARE_ACTION,
  DeleteFareAction,
  EDIT_FARE_ACTION,
  EditFareAction,
  SCHEDULED_FARES_FOR_DATE_QUERY,
  ScheduledFaresForDateQuery,
  SUBCONTRACT_FARE_ACTION,
  SubcontractFareAction
} from '../../providers';
import { DailyPlanningLayout } from '../../layouts';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DurationDistance,
  Entity,
  FaresDeleted,
  FaresEdited,
  FaresSubcontracted,
  isValidPlace,
  JourneyEstimate,
  Place,
  RegularDetails,
  Scheduled
} from '@definitions';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { FormControl, FormGroup } from '@angular/forms';
import { EDIT_FARE_FORM, EditFareFields, FareToEditValues, setEditFareErrorToForm } from './edit-fare.form';
import { destinationFromDestinations, formatEditFareError, toEditFareSuccessToast, toFareToEdit } from './edit-fare.presenter';
import { toDeleteFareSuccessToast } from './delete-fare.presenter';
import { defaultPlaceValue, toJourney } from '../../common/fares.presenter';
import { formatDateToDatetimeLocalString, toDisplayDurationDistance } from '../../common/unit-convertion';
import { EstimateJourneyValues } from '../../components';
import { ESTIMATE_JOURNEY_QUERY, EstimateJourneyQuery } from '@features/common/journey';
import { formatSubcontractFareError, toFareToSubcontract, toSubcontractFareSuccessToast } from './subcontract-fare.presenter';
import { setSubcontractFareErrorToForm, SUBCONTRACT_FARE_FORM, SubcontractFareFields } from './subcontract-fare.form';
import { PlaceValues } from '@features/common/place';
import { DestinationValues } from '@features/common/destination';
import { DriverValues, toDriversValues } from '@features/common/driver';
import { fareHasId, scheduledFareEmptyValue, ScheduledFareValues, toScheduledFaresValues } from '@features/fare';
import { REGULAR_BY_ID_QUERY, RegularByIdQuery, RegularValues, toRegularValues } from '@features/common/regular';
import { forceControlRevalidation, nullToUndefined } from '@features/common/form-validation';

type PageData = {
  fare: ScheduledFareValues;
  regularValues: Entity & RegularValues;
  drivers: DriverValues[];
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-fare.page.html'
})
export class ManageFarePage {
  public readonly scheduledFares$: Observable<ScheduledFareValues[]> = this._planning.planningDay$.pipe(
    switchMap((planningDay: string): Observable<(Entity & Scheduled)[]> => this._faresForDateQuery(planningDay)),
    map(toScheduledFaresValues),
    catchError((error: Error): Observable<ScheduledFareValues[]> => {
      this._toaster.toast({
        content: `Échec de la récupération des courses : ${error.name} | ${error.message}`,
        status: 'danger',
        title: 'Opération échouée'
      });
      return of([]);
    })
  );

  public fareControl: FormControl<ScheduledFareValues> = new FormControl(scheduledFareEmptyValue, { nonNullable: true });

  private readonly _selectedScheduledFare$: BehaviorSubject<ScheduledFareValues> = new BehaviorSubject<ScheduledFareValues>(
    scheduledFareEmptyValue
  );
  public selectedScheduledFare$: Observable<ScheduledFareValues> = this._selectedScheduledFare$.asObservable();

  public onSelectScheduledFareChange(scheduled: ScheduledFareValues): void {
    this._selectedScheduledFare$.next(scheduled);
  }

  public fare$: Observable<ScheduledFareValues> = this.selectedScheduledFare$.pipe(
    tap((fare: ScheduledFareValues): void => {
      if (fareHasId(fare))
        this.editFareForm.controls.departureDatetime.setValue(formatDateToDatetimeLocalString(new Date(fare.datetime)));
    })
  );

  public drivers$: Observable<DriverValues[]> = this._planning.drivers$.pipe(map(toDriversValues));

  public regularValues$: Observable<Entity & RegularValues> = this.selectedScheduledFare$.pipe(
    filter((fare: ScheduledFareValues): boolean => fareHasId(fare)),
    switchMap((fare: ScheduledFareValues): Observable<Entity & RegularDetails> => this._regularByIdQuery$(fare.passenger.id)),
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

  private readonly _departure$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);
  private readonly _destination$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _planning: DailyPlanningLayout,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(SCHEDULED_FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: ScheduledFaresForDateQuery,
    @Inject(REGULAR_BY_ID_QUERY) private readonly _regularByIdQuery$: RegularByIdQuery,
    @Inject(DELETE_FARE_ACTION) private readonly _deleteFareAction$: DeleteFareAction,
    @Inject(EDIT_FARE_ACTION) private readonly _editFareAction$: EditFareAction,
    @Inject(SUBCONTRACT_FARE_ACTION) private readonly _subcontractFareAction$: SubcontractFareAction,
    @Inject(ESTIMATE_JOURNEY_QUERY) private readonly _estimateJourneyQuery$: EstimateJourneyQuery
  ) {}

  //region edit
  public onDepartureSelectedValueChange(place: PlaceValues): void {
    this._departure$.next(place);
  }

  public onDestinationSelectedValueChange(destinationValues: DestinationValues): void {
    this._destination$.next(destinationValues.place);

    if (destinationValues.isTwoWayDrive !== undefined)
      this.editFareForm.controls.isTwoWayDrive.setValue(destinationValues.isTwoWayDrive);

    if (destinationValues.isMedicalDrive !== undefined)
      this.editFareForm.controls.isMedicalDrive.setValue(destinationValues.isMedicalDrive);
  }

  public readonly editFareForm: FormGroup<EditFareFields> = EDIT_FARE_FORM;

  public readonly editFare$ = (): Observable<FaresEdited> =>
    this._editFareAction$(toFareToEdit(nullToUndefined({ id: this.fareControl.value.id, ...this.editFareForm.value })));

  public onSubmitFareToEdit = (triggerAction: () => void): void => {
    this.editFareForm.markAllAsTouched();
    this.editFareForm.valid ? triggerAction() : forceControlRevalidation(this.editFareForm);
  };

  public onEditFareActionSuccess = async (fares: FaresEdited): Promise<void> => {
    this.editFareForm.reset();
    this._toaster.toast(toEditFareSuccessToast(fares));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onEditFareActionError = (error: Error): void => {
    setEditFareErrorToForm(formatEditFareError(error));
    this._toaster.toast({
      content: `Échec de la planification de la course: ${error.name} | ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };
  //endregion

  //region subcontract
  public readonly subcontractFareForm: FormGroup<SubcontractFareFields> = SUBCONTRACT_FARE_FORM;

  public readonly subcontractFare$ = (): Observable<FaresSubcontracted> =>
    // TODO REFACTOR
    this._subcontractFareAction$(
      toFareToSubcontract(
        SUBCONTRACT_FARE_FORM.getRawValue() as { subcontractor: string },
        EDIT_FARE_FORM.getRawValue() as unknown as FareToEditValues
      )
    );

  public onSubmitFareToSubcontract = (triggerAction: () => void): void => {
    SUBCONTRACT_FARE_FORM.markAllAsTouched();
    SUBCONTRACT_FARE_FORM.valid && triggerAction();
  };

  public onSubcontractFareActionSuccess = async (fares: FaresSubcontracted): Promise<void> => {
    SUBCONTRACT_FARE_FORM.reset();
    this._toaster.toast(toSubcontractFareSuccessToast(fares));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onSubcontractFareActionError = (error: Error): void => {
    setSubcontractFareErrorToForm(formatSubcontractFareError(error));
    this._toaster.toast({
      content: 'Échec de la sous-traitance de la course',
      status: 'danger',
      title: 'Opération échouée'
    });
  };
  //endregion

  //region delete
  public readonly deleteFare$ = (): Observable<FaresDeleted> =>
    this._deleteFareAction$(this._selectedScheduledFare$.getValue().id);

  public onDeleteFareActionSuccess = async (payload: FaresDeleted): Promise<void> => {
    this._toaster.toast(toDeleteFareSuccessToast(payload));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onDeleteFareActionError = (_error: Error): void => {
    this._toaster.toast({ content: 'Échec de la suppression', status: 'danger', title: 'Opération échouée' });
  };

  public onClickDeleteFare = (triggerAction: () => void): void => {
    triggerAction();
  };
  //endregion

  //region estimateJourney
  public readonly estimateJourney$: Observable<DurationDistance> = combineLatest([this._departure$, this._destination$]).pipe(
    filter(([departure, destination]: [Place, Place]): boolean => isValidPlace(departure) && isValidPlace(destination)),
    switchMap(
      (): Observable<JourneyEstimate> =>
        // TODO REFACTOR
        this._estimateJourneyQuery$(toJourney(EDIT_FARE_FORM.getRawValue() as unknown as FareToEditValues))
    ),
    map(toDisplayDurationDistance)
  );

  public updateEstimateFields($event: Record<keyof EstimateJourneyValues, FormControl<number>>): void {
    this.editFareForm.controls.driveDuration = $event.driveDuration;
    this.editFareForm.controls.driveDistance = $event.driveDistance;
  }

  //endregion
  public displayIfValidSelection(fare: ScheduledFareValues): boolean {
    return fareHasId(fare);
  }

  public destinationFromPlace: (
    place: PlaceValues | undefined,
    destinations: DestinationValues[] | undefined
  ) => DestinationValues | undefined = destinationFromDestinations;
}

// TODO Re add select fare on click ?
//public selectedSessionContext$: Observable<SessionContext<ScheduledPlanningSession, DailyDriverPlanning>> =
//  this._planning.selectedSessionContext$.pipe(filter(Boolean));
