/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  DELETE_FARE_ACTION,
  DeleteFareAction,
  EDIT_SCHEDULED_ACTION,
  EditScheduledAction,
  SCHEDULED_FARES_FOR_DATE_QUERY,
  ScheduledFaresForDateQuery
} from '../../providers';
import { DeleteFare, EditScheduled, Entity, Regular, Scheduled } from '@definitions';
import { Toast, ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import {
  FareValues,
  initialFareValuesFromScheduledAndRegular,
  isValidFare,
  scheduledFareEmptyValue,
  ScheduledFareValues,
  toScheduledFaresValues
} from '@features/fare';
import { bootstrapValidationClasses, BootstrapValidationClasses, nullToUndefined } from '@features/common/form-validation';
import { REGULAR_BY_ID_QUERY, RegularByIdQuery, RegularValues, toRegularValues } from '@features/regular';
import { EditScheduledFields, FARE_FORM } from '../fare.form';
import {
  findMatchingFare,
  routeParamToFareId,
  toDeleteFareSuccessToasts,
  toEditScheduledSuccessToast,
  toFareSummary,
  toScheduledToEdit
} from './edit-scheduled.presenter';
import { toLongDateFormat, toStandardDateFormat } from '@features/common/angular';
import { DateService } from '../../../common/date/services';
import { DriverValues, LIST_DRIVERS_QUERY, ListDriversQuery, toDriversValues } from '@features/common/driver';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-scheduled.page.html'
})
export class EditScheduledPage {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Output() public editScheduledSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() public editScheduledSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() public editScheduledError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly editScheduled$ = (): Observable<EditScheduled> =>
    this._editScheduledAction$(
      toScheduledToEdit(
        nullToUndefined({
          ...this.editScheduledForm.value,
          passenger: { ...this.fareControl.value.passenger },
          id: this.fareControl.value.id
        })
      )
    );

  public readonly editScheduledForm: FormGroup<EditScheduledFields> = FARE_FORM;

  public selectedDate$: Observable<Date> = this._date.date$();

  public userFriendlyDate$: Observable<string> = this.selectedDate$.pipe(map(toLongDateFormat));

  public readonly scheduledFares$: Observable<ScheduledFareValues[]> = this.selectedDate$.pipe(
    switchMap((date: Date): Observable<(Entity & Scheduled)[]> => this._faresForDateQuery(toStandardDateFormat(date))),
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

  public fareId$: Observable<string> = this._route.params.pipe(
    switchMap((params: Params): Observable<string | undefined> => of(routeParamToFareId('id', params))),
    filter(Boolean)
  );

  public fareFromUrl$: Observable<ScheduledFareValues> = combineLatest([this.scheduledFares$, this.fareId$]).pipe(
    switchMap(findMatchingFare),
    tap((fare: ScheduledFareValues): void => {
      this._selectedScheduledFare$.next(fare);
    }),
    catchError((): Observable<ScheduledFareValues> => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._router.navigate(['../../'], { relativeTo: this._route });
      return of({} as unknown as ScheduledFareValues);
    })
  );

  public fareControl: FormControl<ScheduledFareValues> = new FormControl(scheduledFareEmptyValue, { nonNullable: true });

  private readonly _selectedScheduledFare$: BehaviorSubject<ScheduledFareValues> = new BehaviorSubject<ScheduledFareValues>(
    scheduledFareEmptyValue
  );

  public regular$: Observable<Entity & RegularValues> = this._selectedScheduledFare$.pipe(
    filter((scheduled: ScheduledFareValues): boolean => isValidFare(scheduled)),
    switchMap((fare: ScheduledFareValues): Observable<Entity & Regular> => this._regularByIdQuery$(fare.passenger.id)),
    map(toRegularValues)
  );

  public initialFareValues$: Observable<Partial<Entity & FareValues>> = combineLatest([
    this._selectedScheduledFare$.asObservable(),
    this.regular$
  ]).pipe(
    map(
      //TODO Refactor once Scheduled return destinationValues only
      ([fare, regular]: [ScheduledFareValues, Entity & RegularValues]): Partial<Entity & FareValues> =>
        initialFareValuesFromScheduledAndRegular(fare, regular)
    )
  );

  public onSelectScheduledFareChange(scheduled: ScheduledFareValues): void {
    this._selectedScheduledFare$.next(scheduled);
  }

  public validFare$: Observable<boolean> = this._selectedScheduledFare$.asObservable().pipe(map(isValidFare));

  public drivers$: Observable<DriverValues[]> = this._listDriversQuery$().pipe(map(toDriversValues));

  public onEditScheduledActionSuccess = async (fares: EditScheduled): Promise<void> => {
    this.fareControl.reset();
    this.editScheduledForm.reset();
    this._toaster.toast(toEditScheduledSuccessToast(fares));
    await this._router.navigate(['../../'], { relativeTo: this._route });
  };

  public onEditScheduledActionError = (error: Error): void => {
    this._toaster.toast({
      content: `Échec de l'édition de la course: ${error.name} | ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _date: DateService,
    @Inject(SCHEDULED_FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: ScheduledFaresForDateQuery,
    @Inject(REGULAR_BY_ID_QUERY) private readonly _regularByIdQuery$: RegularByIdQuery,
    @Inject(EDIT_SCHEDULED_ACTION) private readonly _editScheduledAction$: EditScheduledAction,
    @Inject(DELETE_FARE_ACTION) private readonly _deleteFareAction$: DeleteFareAction,
    @Inject(LIST_DRIVERS_QUERY) private readonly _listDriversQuery$: ListDriversQuery //@Inject(SUBCONTRACT_FARE_ACTION) private readonly _subcontractFareAction$: SubcontractFareAction,
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
  //endregion
  public fareSummary(fare: ScheduledFareValues): string {
    return toFareSummary(fare);
  }
}
