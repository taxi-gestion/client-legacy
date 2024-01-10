/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  DELETE_FARE_ACTION,
  DeleteFareAction,
  PENDING_RETURNS_FOR_DATE_QUERY,
  PendingReturnsForDateQuery,
  SCHEDULE_PENDING_ACTION,
  SchedulePendingAction
} from '../../providers';
import { DeleteFare, Entity, Pending, Regular, SchedulePending } from '@definitions';
import { Toast, ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import {
  FareValues,
  findMatchingFare,
  initialValuesFromPendingAndRegular,
  isValidFare,
  pendingReturnEmptyValue,
  PendingReturnValues,
  routeParamToFareId,
  SchedulePendingFields,
  toDeleteFareSuccessToasts,
  toFareSummary,
  toPendingReturnsValues
} from '@features/fare';
import { bootstrapValidationClasses, BootstrapValidationClasses, nullToUndefined } from '@features/common/form-validation';
import { REGULAR_BY_ID_QUERY, RegularByIdQuery, RegularValues, toRegularValues } from '@features/regular';
import { fareForm } from '../fare.form';
import { toReturnToSchedule, toSchedulePendingSuccessToast } from './schedule-pending.presenter';
import { toLongDateFormat, toStandardDateFormat } from '@features/common/angular';
import { DateService } from '../../../common/date/services';
import { DriverValues, LIST_DRIVERS_QUERY, ListDriversQuery, toDriversValues } from '@features/common/driver';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule-pending.page.html'
})
export class SchedulePendingPage {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Output() public schedulePendingSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() public schedulePendingSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() public schedulePendingError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly schedulePending$ = (): Observable<SchedulePending> =>
    this._schedulePendingAction$(
      toReturnToSchedule(
        nullToUndefined({
          ...this.schedulePendingForm.value,
          id: this.fareControl.value.id
        })
      )
    );

  public readonly schedulePendingForm: FormGroup<SchedulePendingFields> = fareForm();

  public selectedDate$: Observable<Date> = this._date.date$();
  public userFriendlyDate$: Observable<string> = this.selectedDate$.pipe(map(toLongDateFormat));

  public readonly pendingReturns$: Observable<PendingReturnValues[]> = this.selectedDate$.pipe(
    switchMap((date: Date): Observable<(Entity & Pending)[]> => this._pendingReturnsForDateQuery(toStandardDateFormat(date))),
    map(toPendingReturnsValues),
    catchError((error: Error): Observable<PendingReturnValues[]> => {
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

  public fareFromUrl$: Observable<PendingReturnValues> = combineLatest([this.pendingReturns$, this.fareId$]).pipe(
    switchMap(findMatchingFare),
    tap((fare: PendingReturnValues): void => {
      this._selectedPendingReturn$.next(fare);
    }),
    catchError((): Observable<PendingReturnValues> => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._router.navigate(['../../'], { relativeTo: this._route });
      return of({} as unknown as PendingReturnValues);
    })
  );

  public fareControl: FormControl<PendingReturnValues> = new FormControl(pendingReturnEmptyValue, {
    nonNullable: true
  });

  private readonly _selectedPendingReturn$: BehaviorSubject<PendingReturnValues> = new BehaviorSubject<PendingReturnValues>(
    pendingReturnEmptyValue
  );

  public regular$: Observable<Entity & RegularValues> = this._selectedPendingReturn$.pipe(
    filter((pending: PendingReturnValues): boolean => isValidFare(pending)),
    switchMap((fare: PendingReturnValues): Observable<Entity & Regular> => this._regularByIdQuery$(fare.passenger.id)),
    map(toRegularValues)
  );

  public initialPendingValues$: Observable<Partial<Entity & FareValues>> = combineLatest([
    this._selectedPendingReturn$.asObservable(),
    this.regular$
  ]).pipe(
    map(
      ([pending, regular]: [PendingReturnValues, Entity & RegularValues]): Partial<Entity & FareValues> =>
        initialValuesFromPendingAndRegular(pending, regular)
    )
  );

  public onSelectPendingReturnChange(scheduled: PendingReturnValues): void {
    this._selectedPendingReturn$.next(scheduled);
  }

  public validFare$: Observable<boolean> = this._selectedPendingReturn$.asObservable().pipe(map(isValidFare));

  public drivers$: Observable<DriverValues[]> = this._listDriversQuery$().pipe(map(toDriversValues));

  public onSchedulePendingActionSuccess = async (fares: SchedulePending): Promise<void> => {
    this.fareControl.reset();
    this.schedulePendingForm.reset();
    this._toaster.toast(toSchedulePendingSuccessToast(fares));
    await this._router.navigate(['../../'], { relativeTo: this._route });
  };

  public onSchedulePendingActionError = (error: Error): void => {
    this._toaster.toast({
      content: `Échec de l'édition de la course: ${error.name} | ${error.message}`,
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
    @Inject(PENDING_RETURNS_FOR_DATE_QUERY) private readonly _pendingReturnsForDateQuery: PendingReturnsForDateQuery,
    @Inject(REGULAR_BY_ID_QUERY) private readonly _regularByIdQuery$: RegularByIdQuery,
    @Inject(SCHEDULE_PENDING_ACTION) private readonly _schedulePendingAction$: SchedulePendingAction
  ) {}

  public fareSummary(fare: PendingReturnValues): string {
    return toFareSummary(fare);
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
