/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import {
  DELETE_FARE_ACTION,
  DeleteFareAction,
  EDIT_FARE_ACTION,
  EditFareAction,
  SUBCONTRACT_FARE_ACTION,
  SubcontractFareAction
} from '../../providers';
import { DailyPlanningLayout } from '../../layouts';
import { SessionContext } from '../../components/planning/planning-row/planning-row.component';
import { DailyDriverPlanning, ScheduledPlanningSession } from '../../common/fares.presentation';
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
  RegularDetails
} from '@definitions';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { FormControl, FormGroup } from '@angular/forms';
import { EDIT_FARE_FORM, EditFareFields, FareToEditValues, setEditFareErrorToForm } from './edit-fare.form';
import {
  destinationFromPlace,
  formatEditFareError,
  ManageFarePresentation,
  toEditFareSuccessToast,
  toFareToEdit
} from './edit-fare.presenter';
import { toDeleteFareSuccessToast } from './delete-fare.presenter';
import { defaultPlaceValue, RegularPresentation, toJourney, toRegularPresentation } from '../../common/fares.presenter';
import { formatDateToDatetimeLocalString, toDisplayDurationDistance } from '../../common/unit-convertion';
import { EstimateJourneyValues } from '../../components';
import { ESTIMATE_JOURNEY_QUERY, EstimateJourneyQuery } from '@features/common/journey';
import { formatSubcontractFareError, toFareToSubcontract, toSubcontractFareSuccessToast } from './subcontract-fare.presenter';
import { setSubcontractFareErrorToForm, SUBCONTRACT_FARE_FORM, SubcontractFareFields } from './subcontract-fare.form';
import { REGULAR_BY_ID_QUERY, RegularByIdQuery, RegularValues, toRegularValues } from '@features/common/regular';
import { PlaceValues } from '@features/common/place';
import { DestinationValues } from '@features/common/destination';
import { DriverValues, toDriversValues } from '@features/common/driver';
import { toPhoneValues } from '@features/common/phone';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-fare.page.html'
})
export class ManageFarePage {
  public selectedSessionContext$: Observable<SessionContext<ScheduledPlanningSession, DailyDriverPlanning>> =
    this._planning.selectedSessionContext$.pipe(filter(Boolean));

  public fare$: Observable<ManageFarePresentation> = this.selectedSessionContext$.pipe(
    map(
      (context: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>): ManageFarePresentation => ({
        ...context.sessionContext,
        phone: toPhoneValues(context.sessionContext.passenger.phone)
      })
    ),
    tap((fare: ManageFarePresentation): void => {
      this.editFareForm.controls.departureDatetime.setValue(formatDateToDatetimeLocalString(new Date(fare.datetime)));
    })
  );

  public drivers$: Observable<DriverValues[]> = this._planning.drivers$.pipe(map(toDriversValues));

  // TODO Get regular by id
  // TODO Refactor ALL Observables
  public regularValues$: Observable<Entity & RegularValues> = this.selectedSessionContext$.pipe(
    switchMap(
      (selectedSession: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>): Observable<Entity & RegularDetails> =>
        this._regularByIdQuery$(selectedSession.sessionContext.passenger.id)
    ),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map((regular: Entity & RegularDetails): Entity & RegularValues => toRegularValues(regular))
  );

  public regular$: Observable<RegularPresentation> = this.regularValues$.pipe(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map((regular: Entity & RegularValues): RegularPresentation => toRegularPresentation(regular))
  );

  public destinationFromPlace$: Observable<DestinationValues> = combineLatest([this.fare$, this.regular$]).pipe(
    map(destinationFromPlace)
  );

  private readonly _departure$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);
  private readonly _destination$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _planning: DailyPlanningLayout,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
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
    this.editFareForm.controls.isMedicalDrive.setValue(destinationValues.isMedicalDrive);
    this.editFareForm.controls.isTwoWayDrive.setValue(destinationValues.isTwoWayDrive);
  }

  public readonly editFareForm: FormGroup<EditFareFields> = EDIT_FARE_FORM;

  //TODO Type to Observable<Error | Entity & Scheduled>
  public readonly editFare$ = (): Observable<FaresEdited> =>
    // TODO Had to use EDIT_FARE_FORM.getRawValue() instead of EDIT_FARE_FORM.value for the latest controls value to be retreived
    this._editFareAction$(toFareToEdit(EDIT_FARE_FORM.getRawValue() as unknown as FareToEditValues));

  public onSubmitFareToEdit = (triggerAction: () => void): void => {
    EDIT_FARE_FORM.markAllAsTouched();
    EDIT_FARE_FORM.valid && triggerAction();
  };

  public onEditFareActionSuccess = async (fares: FaresEdited): Promise<void> => {
    EDIT_FARE_FORM.reset();
    this._toaster.toast(toEditFareSuccessToast(fares));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onEditFareActionError = (error: Error): void => {
    setEditFareErrorToForm(formatEditFareError(error));
    this._toaster.toast({ content: 'Échec de la planification de la course', status: 'danger', title: 'Opération échouée' });
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
    this._toaster.toast({ content: 'Échec de la sous-traitance de la course', status: 'danger', title: 'Opération échouée' });
  };
  //endregion

  //region delete
  public readonly deleteFare$ = (): Observable<FaresDeleted> =>
    this.selectedSessionContext$.pipe(
      switchMap(
        (context: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>): Observable<FaresDeleted> =>
          this._deleteFareAction$(context.sessionContext.id)
      )
    );

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
}
