/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { DELETE_FARE_ACTION, DeleteFareAction, EDIT_FARE_ACTION, EditFareAction } from '../../providers';
import { DailyPlanningLayout } from '../../layouts';
import { SessionContext } from '../../components/planning/planning-row/planning-row.component';
import { DailyDriverPlanning, ScheduledPlanningSession } from '../../common/fares.presentation';
import { ActivatedRoute, Router } from '@angular/router';
import { Driver, DurationDistance, Entity, isValidPlace, JourneyEstimate, Passenger, Pending, Place, Scheduled } from '@domain';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { FormControl, FormGroup } from '@angular/forms';
import { EDIT_FARE_FORM, EditFareFields, FareToEditPresentation, setEditFareErrorToForm } from './edit-fare.form';
import { formatEditFareError, passengerFromContext, toEditFareSuccessToast, toFareToEdit } from './edit-fare.presenter';
import { toDeleteFareSuccessToast } from './delete-fare.presenter';
import { defaultPlaceValue, toJourney } from '../../common/fares.presenter';
import { formatDateToDatetimeLocalString, toDisplayDurationDistance } from '../../common/unit-convertion';
import { EstimateJourneyValues } from '../../components';
import { ESTIMATE_JOURNEY_QUERY, EstimateJourneyQuery } from '@features/common';

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

  public readonly editFareForm: FormGroup<EditFareFields> = EDIT_FARE_FORM;

  private readonly _departure: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  private readonly _destination: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _planning: DailyPlanningLayout,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(DELETE_FARE_ACTION) private readonly _deleteFareAction$: DeleteFareAction,
    @Inject(EDIT_FARE_ACTION) private readonly _editFareAction$: EditFareAction,
    @Inject(ESTIMATE_JOURNEY_QUERY) private readonly _estimateJourneyQuery$: EstimateJourneyQuery
  ) {}

  //region edit
  //TODO Type to Observable<Error | Entity & Scheduled>
  public readonly editFare$ = (): Observable<object> =>
    // TODO Had to use EDIT_FARE_FORM.getRawValue() instead of EDIT_FARE_FORM.value for the latest controls value to be retreived
    this._editFareAction$(toFareToEdit(EDIT_FARE_FORM.getRawValue() as FareToEditPresentation));

  public onSubmitFareToEdit = (triggerAction: () => void): void => {
    EDIT_FARE_FORM.markAllAsTouched();
    EDIT_FARE_FORM.valid && triggerAction();
  };

  public onEditFareActionSuccess = async (payload: unknown): Promise<void> => {
    EDIT_FARE_FORM.reset();
    // TODO Type action and modify returned payload
    this._toaster.toast(toEditFareSuccessToast(payload as { rows: (Entity & Scheduled)[] }[]));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onEditFareActionError = (error: Error): void => {
    setEditFareErrorToForm(formatEditFareError(error));
    this._toaster.toast({ content: 'Échec de la planification de la course', status: 'danger', title: 'Opération échouée' });
  };
  //enregion

  //region delete
  public readonly deleteFare$ = (): Observable<[Entity & Scheduled, (Entity & Pending)?]> =>
    this.selectedSessionContext$.pipe(
      switchMap(
        (
          context: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>
        ): Observable<[Entity & Scheduled, (Entity & Pending)?]> => this._deleteFareAction$(context.sessionContext.id)
      )
    );

  public onDeleteFareActionSuccess = async (payload: [Entity & Scheduled, (Entity & Pending)?]): Promise<void> => {
    // TODO Type action and modify returned payload
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
  public onSelectDepartureChange(place: Place): void {
    this.editFareForm.controls.departurePlace.setValue(place);
    this._departure$.next(place);
  }

  public onSelectArrivalChange(place: Place): void {
    this.editFareForm.controls.arrivalPlace.setValue(place);
    this._destination$.next(place);
  }

  public onSelectDriverChange(driver: Driver): void {
    this.editFareForm.controls.driver.setValue(driver.identifier);
    this._driverDisplay$.next(driver.identifier);
  }

  public onSelectPassengerChange(passenger: Passenger): void {
    this.editFareForm.controls.passenger.setValue(passenger.passenger);
    this.editFareForm.controls.phoneToCall.setValue(passenger.phone);
  }

  public onSearchPassengerTermChange(search: string): void {
    this.editFareForm.controls.passenger.setValue(search);
  }
  //endregion

  //region estimateJourney
  public readonly estimateJourney$: Observable<DurationDistance> = combineLatest([this._departure, this._destination]).pipe(
    filter(([departure, destination]: [Place, Place]): boolean => isValidPlace(departure) && isValidPlace(destination)),
    switchMap(
      (): Observable<JourneyEstimate> =>
        this._estimateJourneyQuery$(toJourney(EDIT_FARE_FORM.getRawValue() as FareToEditPresentation))
    ),
    map(toDisplayDurationDistance)
  );

  public updateEstimateFields($event: Record<keyof EstimateJourneyValues, FormControl<number>>): void {
    this.editFareForm.controls.driveDuration = $event.driveDuration;
    this.editFareForm.controls.driveDistance = $event.driveDistance;
  }
  //endregion

  private readonly _departure$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);

  public departureDisplay$: Observable<string> = this._departure$
    .asObservable()
    .pipe(map((place: Place): string => place.context));

  private readonly _destination$: BehaviorSubject<Place> = new BehaviorSubject<Place>(defaultPlaceValue);
  public destinationDisplay$: Observable<string> = this._destination$
    .asObservable()
    .pipe(map((place: Place): string => place.context));

  private readonly _driverDisplay$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public driverDisplay$: Observable<string> = this._driverDisplay$.asObservable();

  // eslint-disable-next-line max-statements
  private initializeFormValuesFromContext(
    selectedSession: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>
  ): void {
    this.editFareForm.controls.id.setValue(selectedSession.sessionContext.id);
    this.editFareForm.controls.passenger.setValue(selectedSession.sessionContext.passenger);
    this.editFareForm.controls.phoneToCall.setValue(selectedSession.sessionContext.phone);
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
    this._driverDisplay$.next(selectedSession.sessionContext.driver);
  }
}
