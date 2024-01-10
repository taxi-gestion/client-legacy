/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { DeleteFare, Entity, Regular, ScheduleUnassigned, Unassigned } from '@definitions';
import { Toast, ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import {
  DELETE_FARE_ACTION,
  DeleteFareAction,
  FareFields,
  FareValues,
  findMatchingFare,
  initialFareValuesFromUnassignedAndRegular,
  isValidFare,
  routeParamToFareId,
  SCHEDULE_UNASSIGNED_ACTION,
  ScheduleUnassignedAction,
  toDeleteFareSuccessToasts,
  toFareSummary,
  toUnassignedFaresValues,
  UNASSIGNED_FARES_FOR_DATE_QUERY,
  unassignedFareEmptyValue,
  UnassignedFaresForDateQuery,
  UnassignedFareValues
} from '@features/fare';
import { bootstrapValidationClasses, BootstrapValidationClasses, nullToUndefined } from '@features/common/form-validation';
import { REGULAR_BY_ID_QUERY, RegularByIdQuery, RegularValues, toRegularValues } from '@features/regular';
import { fareForm } from '../fare.form';
import { toScheduleUnassignedSuccessToast, toUnassignedToSchedule } from './schedule-unassigned.presenter';
import { toLongDateFormat, toStandardDateFormat } from '@features/common/angular';
import { DateService } from '../../../common/date/services';
import { DriverValues, LIST_DRIVERS_QUERY, ListDriversQuery, toDriversValues } from '@features/common/driver';
import { ActivatedRoute, Params, Router } from '@angular/router';

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

  public readonly scheduleUnassignedForm: FormGroup<FareFields> = fareForm();

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

  public fareId$: Observable<string> = this._route.params.pipe(
    switchMap((params: Params): Observable<string | undefined> => of(routeParamToFareId('id', params))),
    filter(Boolean)
  );

  public fareFromUrl$: Observable<UnassignedFareValues> = combineLatest([this.unassignedFares$, this.fareId$]).pipe(
    switchMap(findMatchingFare),
    tap((fare: UnassignedFareValues): void => {
      this._selectedUnassignedFare$.next(fare);
    }),
    catchError((): Observable<UnassignedFareValues> => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._router.navigate(['../../'], { relativeTo: this._route });
      return of({} as unknown as UnassignedFareValues);
    })
  );

  public fareControl: FormControl<UnassignedFareValues> = new FormControl(unassignedFareEmptyValue, {
    nonNullable: true
  });

  private readonly _selectedUnassignedFare$: BehaviorSubject<UnassignedFareValues> = new BehaviorSubject<UnassignedFareValues>(
    unassignedFareEmptyValue
  );

  public regular$: Observable<Entity & RegularValues> = this._selectedUnassignedFare$.pipe(
    filter((unassigned: UnassignedFareValues): boolean => isValidFare(unassigned)),
    switchMap((fare: UnassignedFareValues): Observable<Entity & Regular> => this._regularByIdQuery$(fare.passenger.id)),
    map(toRegularValues)
  );

  public initialUnassignedValues$: Observable<Partial<Entity & FareValues>> = combineLatest([
    this._selectedUnassignedFare$.asObservable(),
    this.regular$
  ]).pipe(
    map(
      ([unassigned, regular]: [UnassignedFareValues, Entity & RegularValues]): Partial<Entity & FareValues> =>
        initialFareValuesFromUnassignedAndRegular(unassigned, regular)
    )
  );

  public onSelectUnassignedFareChange(scheduled: UnassignedFareValues): void {
    this._selectedUnassignedFare$.next(scheduled);
  }

  public validFare$: Observable<boolean> = this._selectedUnassignedFare$.asObservable().pipe(map(isValidFare));

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
  ) {}

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

  public fareSummary(fare: UnassignedFareValues): string {
    return toFareSummary(fare);
  }
  //endregion
}
