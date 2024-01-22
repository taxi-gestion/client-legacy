import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap } from 'rxjs';
import { SCHEDULE_FARE_ACTION, ScheduleFareAction } from '../../providers';
import { fareForm } from '../fare.form';
import {
  RegularFaresContext,
  toFareToSchedule,
  toRegularFaresContext,
  toScheduleFareSuccessToast
} from './plan-with-context.presenter';
import { Entity, RegularHistory, ScheduleScheduled } from '@definitions';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';

import { nullToUndefined } from '@features/common/form-validation';
import { DriverValues, LIST_DRIVERS_QUERY, ListDriversQuery, toDriversValues } from '@features/common/driver';
import {
  isValidRegular,
  REGULAR_HISTORY_QUERY,
  regularEmptyValue,
  RegularHistoryQuery,
  RegularValues
} from '@features/regular';
import { FareValues, initialFareValuesFromRegular, ScheduleScheduledFields } from '@features/fare';
import { DateService } from '@features/common/date';
import { toLongDateFormat } from '@features/common/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plan-with-context.page.html'
})
export class PlanWithContextPage {
  @Output() public scheduleFareSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly scheduleFare$ = (): Observable<ScheduleScheduled> =>
    this._scheduleFareAction$(
      toFareToSchedule(
        nullToUndefined({
          ...this.scheduleFareForm.value,
          passenger: { ...this.regularControl.value }
        })
      )
    );

  public readonly scheduleFareForm: FormGroup<ScheduleScheduledFields> = fareForm();
  public regularControl: FormControl<Entity & RegularValues> = new FormControl(regularEmptyValue, { nonNullable: true });

  public selectedDate$: Observable<Date> = this._date.date$();
  public userFriendlyDate$: Observable<string> = this.selectedDate$.pipe(map(toLongDateFormat));

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _date: DateService,
    @Inject(SCHEDULE_FARE_ACTION) private readonly _scheduleFareAction$: ScheduleFareAction,
    @Inject(LIST_DRIVERS_QUERY) private readonly _listDriversQuery$: ListDriversQuery,
    @Inject(REGULAR_HISTORY_QUERY) private readonly _regularHistoryQuery$: RegularHistoryQuery
  ) {}

  private readonly _regular$: BehaviorSubject<Entity & RegularValues> = new BehaviorSubject<Entity & RegularValues>(
    regularEmptyValue
  );

  public onSelectRegularChange(regular: Entity & RegularValues): void {
    this._regular$.next(regular);
  }

  public regular$: Observable<Entity & RegularValues> = this._regular$.asObservable();

  public validRegular$: Observable<boolean> = this._regular$.asObservable().pipe(map(isValidRegular));

  public readonly regularFaresContext$: Observable<RegularFaresContext> = combineLatest([
    this.regular$,
    this.validRegular$
  ]).pipe(
    filter(([_, isValid]: [_: Entity & RegularValues, isValid: boolean]): boolean => isValid),
    switchMap(
      ([regular]: [regular: Entity & RegularValues, _: boolean]): Observable<RegularHistory> =>
        this._regularHistoryQuery$(regular.id)
    ),
    map(toRegularFaresContext)
  );

  public prefilledFare$: Observable<Partial<FareValues>> = this.regular$.pipe(
    filter(isValidRegular),
    map(initialFareValuesFromRegular)
  );

  public drivers$: Observable<DriverValues[]> = this._listDriversQuery$().pipe(map(toDriversValues));

  public onScheduleFareActionSuccess = (fares: ScheduleScheduled): void => {
    this.scheduleFareForm.reset();
    this._toaster.toast(toScheduleFareSuccessToast(fares));
    this.onSelectRegularChange(this._regular$.getValue());
  };

  public onRegularUpdated = (regular: Entity & RegularValues): void => {
    this._regular$.next(regular);
  };

  public onScheduleFareActionError = (error: Error): void => {
    this._toaster.toast({
      content: `Échec de la planification de la course: ${error.name} | ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };
}
