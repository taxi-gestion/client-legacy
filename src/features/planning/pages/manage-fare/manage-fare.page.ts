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
  Driver,
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
import { formatEditFareError, passengerFromContext, toEditFareSuccessToast, toFareToEdit } from './edit-fare.presenter';
import { toDeleteFareSuccessToast } from './delete-fare.presenter';
import { defaultPlaceValue, toJourney } from '../../common/fares.presenter';
import { formatDateToDatetimeLocalString, toDisplayDurationDistance } from '../../common/unit-convertion';
import { EstimateJourneyValues } from '../../components';
import { ESTIMATE_JOURNEY_QUERY, EstimateJourneyQuery } from '@features/common';
import { formatSubcontractFareError, toFareToSubcontract, toSubcontractFareSuccessToast } from './subcontract-fare.presenter';
import { setSubcontractFareErrorToForm, SUBCONTRACT_FARE_FORM, SubcontractFareFields } from './subcontract-fare.form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-fare.page.html'
})
export class ManageFarePage {
  public selectedSessionContext$: Observable<SessionContext<ScheduledPlanningSession, DailyDriverPlanning>> =
    this._planning.selectedSessionContext$.pipe(filter(Boolean));

  // TODO Use observable to bind field values
  public selectedSessionToFormValues$: Observable<SessionContext<ScheduledPlanningSession, DailyDriverPlanning>> =
    this.selectedSessionContext$.pipe(
      tap((selectedSession: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>): void =>
        this.initializeFormValuesFromContext(selectedSession)
      )
    );

  public selectedSessionPassenger$: Observable<string> = this.selectedSessionContext$.pipe(map(passengerFromContext));

  private readonly _departure$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);
  private readonly _destination$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _planning: DailyPlanningLayout,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(DELETE_FARE_ACTION) private readonly _deleteFareAction$: DeleteFareAction,
    @Inject(EDIT_FARE_ACTION) private readonly _editFareAction$: EditFareAction,
    @Inject(SUBCONTRACT_FARE_ACTION) private readonly _subcontractFareAction$: SubcontractFareAction,
    @Inject(ESTIMATE_JOURNEY_QUERY) private readonly _estimateJourneyQuery$: EstimateJourneyQuery
  ) {}

  //region edit
  public readonly editFareForm: FormGroup<EditFareFields> = EDIT_FARE_FORM;

  //TODO Type to Observable<Error | Entity & Scheduled>
  public readonly editFare$ = (): Observable<FaresEdited> =>
    // TODO Had to use EDIT_FARE_FORM.getRawValue() instead of EDIT_FARE_FORM.value for the latest controls value to be retreived
    this._editFareAction$(toFareToEdit(EDIT_FARE_FORM.getRawValue() as FareToEditValues));

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
    // TODO Had to use SUBCONTRACT_FARE_FORM.getRawValue() instead of SUBCONTRACT_FARE_FORM.value for the latest controls value to be retreived
    this._subcontractFareAction$(
      toFareToSubcontract(
        SUBCONTRACT_FARE_FORM.getRawValue() as { subcontractor: string },
        EDIT_FARE_FORM.getRawValue() as FareToEditValues
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

  //region formEvents
  public onSelectRegularChange(regular: RegularDetails): void {
    this.editFareForm.controls.passenger.setValue(`${regular.lastname} ${regular.firstname}`);
    this.editFareForm.controls.phoneToCall.setValue(regular.phones?.[0]?.number ?? '');
    // TODO Adapt Regular
  }

  public onSelectDepartureChange(place: Place): void {
    this.editFareForm.controls.departurePlace.setValue(place);
    this._departure$.next(place);
  }

  public onSelectArrivalChange(place: Place): void {
    this.editFareForm.controls.arrivalPlace.setValue(place);
    this._destination$.next(place);
  }

  public onSelectDriverChange(driver: Driver & Entity): void {
    this.editFareForm.controls.driver.setValue(driver);
    this._driverDisplay$.next(driver.identifier);
  }

  public onSearchRegularTermChange(search: string): void {
    this.editFareForm.controls.passenger.setValue(search);
  }
  //endregion

  //region estimateJourney
  public readonly estimateJourney$: Observable<DurationDistance> = combineLatest([this._departure$, this._destination$]).pipe(
    filter(([departure, destination]: [Place, Place]): boolean => isValidPlace(departure) && isValidPlace(destination)),
    switchMap(
      (): Observable<JourneyEstimate> =>
        this._estimateJourneyQuery$(toJourney(EDIT_FARE_FORM.getRawValue() as FareToEditValues))
    ),
    map(toDisplayDurationDistance)
  );

  public updateEstimateFields($event: Record<keyof EstimateJourneyValues, FormControl<number>>): void {
    this.editFareForm.controls.driveDuration = $event.driveDuration;
    this.editFareForm.controls.driveDistance = $event.driveDistance;
  }
  //endregion

  public departure$: Observable<Place> = this._departure$.asObservable();

  public destination$: Observable<Place> = this._destination$.asObservable();

  private readonly _driverDisplay$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public driverDisplay$: Observable<string> = this._driverDisplay$.asObservable();

  // eslint-disable-next-line max-statements
  private initializeFormValuesFromContext(
    selectedSession: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>
  ): void {
    this.editFareForm.controls.id.setValue(selectedSession.sessionContext.id);
    this.editFareForm.controls.passenger.setValue(selectedSession.sessionContext.passenger.passenger);
    this.editFareForm.controls.phoneToCall.setValue(selectedSession.sessionContext.passenger.phone);
    this.editFareForm.controls.departureDatetime.setValue(
      formatDateToDatetimeLocalString(new Date(selectedSession.sessionContext.datetime))
    );
    this.editFareForm.controls.departurePlace.setValue(selectedSession.sessionContext.departure);
    this.editFareForm.controls.arrivalPlace.setValue(selectedSession.sessionContext.destination);
    this.editFareForm.controls.driveDuration.setValue(selectedSession.sessionContext.duration);
    this.editFareForm.controls.driveDistance.setValue(selectedSession.sessionContext.distance);
    this.editFareForm.controls.driver.setValue(selectedSession.sessionContext.driver);
    this.editFareForm.controls.isTwoWayDrive.setValue(selectedSession.sessionContext.kind === 'two-way');
    this.editFareForm.controls.isMedicalDrive.setValue(selectedSession.sessionContext.nature === 'medical');
    this._departure$.next(selectedSession.sessionContext.departure);
    this._destination$.next(selectedSession.sessionContext.destination);
    //this._driverDisplay$.next(selectedSession.sessionContext.driver);
  }
}
