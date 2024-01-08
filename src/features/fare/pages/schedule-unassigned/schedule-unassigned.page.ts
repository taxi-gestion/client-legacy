/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, switchMap } from 'rxjs';
import { DeleteFare, Entity, Regular, ScheduleUnassigned, Unassigned } from '@definitions';
import { Toast, ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import {
  DELETE_FARE_ACTION,
  DeleteFareAction,
  FareFields,
  FareValues,
  initialFareValuesFromUnassignedAndRegular,
  isValidFare,
  SCHEDULE_UNASSIGNED_ACTION,
  ScheduleUnassignedAction,
  toDeleteFareSuccessToasts,
  toUnassignedFaresValues,
  UNASSIGNED_FARES_FOR_DATE_QUERY,
  unassignedFareEmptyValue,
  UnassignedFaresForDateQuery,
  UnassignedFareValues
} from '@features/fare';
import { bootstrapValidationClasses, BootstrapValidationClasses, nullToUndefined } from '@features/common/form-validation';
import { REGULAR_BY_ID_QUERY, RegularByIdQuery, RegularValues, toRegularValues } from '@features/regular';
import { FARE_FORM } from '../fare.form';
import { toScheduleUnassignedSuccessToast, toUnassignedToSchedule } from './schedule-unassigned.presenter';
import { toLongDateFormat, toStandardDateFormat } from '@features/common/angular';
import { DateService } from '../../../common/date/services';
import { DriverValues, LIST_DRIVERS_QUERY, ListDriversQuery, toDriversValues } from '@features/common/driver';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule-unassigned.page.html'
})
export class ScheduleUnassignedPage {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Output() public scheduleUnassignedSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() public scheduleUnassignedSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() public scheduleUnassignedError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly scheduleUnassigned$ = (): Observable<ScheduleUnassigned> =>
    this._scheduleUnassignedAction$(
      toUnassignedToSchedule(
        nullToUndefined({
          ...this.scheduleUnassignedForm.value,
          passenger: { ...this.fareControl.value.passenger },
          id: this.fareControl.value.id
        })
      )
    );

  public readonly scheduleUnassignedForm: FormGroup<FareFields> = FARE_FORM;

  public selectedDate$: Observable<Date> = this._date.date$();
  public userFriendlyDate$: Observable<string> = this.selectedDate$.pipe(map(toLongDateFormat));

  public readonly unassignedFares$: Observable<UnassignedFareValues[]> = this.selectedDate$.pipe(
    switchMap(
      (date: Date): Observable<(Entity & Unassigned)[]> => this._unassignedFaresForDateQuery(toStandardDateFormat(date))
    ),
    map(toUnassignedFaresValues),
    catchError((error: Error): Observable<UnassignedFareValues[]> => {
      this._toaster.toast({
        content: `Échec de la récupération des courses : ${error.name} | ${error.message}`,
        status: 'danger',
        title: 'Opération échouée'
      });
      return of([]);
    })
  );

  public fareControl: FormControl<UnassignedFareValues> = new FormControl(unassignedFareEmptyValue, {
    nonNullable: true
  });

  private readonly _selectedUnassignedReturn$: BehaviorSubject<UnassignedFareValues> =
    new BehaviorSubject<UnassignedFareValues>(unassignedFareEmptyValue);

  public regular$: Observable<Entity & RegularValues> = this._selectedUnassignedReturn$.pipe(
    filter((unassigned: UnassignedFareValues): boolean => isValidFare(unassigned)),
    switchMap((fare: UnassignedFareValues): Observable<Entity & Regular> => this._regularByIdQuery$(fare.passenger.id)),
    map(toRegularValues)
  );

  public initialUnassignedValues$: Observable<Partial<Entity & FareValues>> = combineLatest([
    this._selectedUnassignedReturn$.asObservable(),
    this.regular$
  ]).pipe(
    map(
      ([unassigned, regular]: [UnassignedFareValues, Entity & RegularValues]): Partial<Entity & FareValues> =>
        initialFareValuesFromUnassignedAndRegular(unassigned, regular)
    )
  );

  public onSelectUnassignedFareChange(scheduled: UnassignedFareValues): void {
    this._selectedUnassignedReturn$.next(scheduled);
  }

  public validFare$: Observable<boolean> = this._selectedUnassignedReturn$.asObservable().pipe(map(isValidFare));

  public drivers$: Observable<DriverValues[]> = this._listDriversQuery$().pipe(map(toDriversValues));

  public onScheduleUnassignedActionSuccess = async (fares: ScheduleUnassigned): Promise<void> => {
    this.fareControl.reset();
    this.scheduleUnassignedForm.reset();
    this._toaster.toast(toScheduleUnassignedSuccessToast(fares));
    await this._router.navigate(['../../'], { relativeTo: this._route });
  };

  public onScheduleUnassignedActionError = (error: Error): void => {
    this._toaster.toast({
      content: `Échec de l'assignation de la course: ${error.name} | ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };

  public constructor(
    private readonly _date: DateService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _toaster: ToasterPresenter,
    @Inject(DELETE_FARE_ACTION) private readonly _deleteFareAction$: DeleteFareAction,
    @Inject(LIST_DRIVERS_QUERY) private readonly _listDriversQuery$: ListDriversQuery,
    @Inject(REGULAR_BY_ID_QUERY) private readonly _regularByIdQuery$: RegularByIdQuery,
    @Inject(SCHEDULE_UNASSIGNED_ACTION) private readonly _scheduleUnassignedAction$: ScheduleUnassignedAction,
    @Inject(UNASSIGNED_FARES_FOR_DATE_QUERY) private readonly _unassignedFaresForDateQuery: UnassignedFaresForDateQuery
  ) {
    // TODO There is an unwanted binding because of the const
    this.scheduleUnassignedForm.reset();
  }

  //region delete
  public readonly deleteFare$$ = (id: string) => (): Observable<DeleteFare> => this._deleteFareAction$(id);

  public onDeleteFareActionSuccess = async (payload: DeleteFare): Promise<void> => {
    toDeleteFareSuccessToasts(payload).forEach((toast: Toast): void => {
      this._toaster.toast(toast);
    });
    await this._router.navigate(['../../'], { relativeTo: this._route });
  };

  public onDeleteFareActionError = (_error: Error): void => {
    this._toaster.toast({ content: 'Échec de la suppression', status: 'danger', title: 'Opération échouée' });
  };
  //endregion
}
