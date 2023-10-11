import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { SCHEDULE_FARE_ACTION, ScheduleFareAction } from '../../providers';
import { FARE_FORM, ScheduleFareFields } from '../fare.form';
import { toFareToSchedule, toScheduleFareSuccessToast } from './schedule-fare.presenter';
import { Entity, FaresScheduled } from '@definitions';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';

import { nullToUndefined } from '@features/common/form-validation';
import { DriverValues, LIST_DRIVERS_QUERY, ListDriversQuery, toDriversValues } from '@features/common/driver';
import { isValidRegular, regularEmptyValue, RegularValues } from '@features/common/regular';
import { FareValues, initialFareValuesFromRegular } from '@features/fare';
import { DateService } from '@features/common/date';
import { toLongDateFormat } from '@features/common/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule-fare.page.html'
})
export class ScheduleFarePage {
  @Output() public scheduleFareSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleFareError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly scheduleFare$ = (): Observable<FaresScheduled> =>
    this._scheduleFareAction$(
      toFareToSchedule(
        nullToUndefined({
          ...this.scheduleFareForm.value,
          passenger: { ...this.regularControl.value }
        })
      )
    );

  public readonly scheduleFareForm: FormGroup<ScheduleFareFields> = FARE_FORM;
  public regularControl: FormControl<Entity & RegularValues> = new FormControl(regularEmptyValue, { nonNullable: true });

  public selectedDate$: Observable<Date> = this._date.date$();
  public userFriendlyDate$: Observable<string> = this.selectedDate$.pipe(map(toLongDateFormat));

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _date: DateService,
    @Inject(SCHEDULE_FARE_ACTION) private readonly _scheduleFareAction$: ScheduleFareAction,
    @Inject(LIST_DRIVERS_QUERY) private readonly _listDriversQuery$: ListDriversQuery
  ) {}

  private readonly _regular$: BehaviorSubject<Entity & RegularValues> = new BehaviorSubject<Entity & RegularValues>(
    regularEmptyValue
  );

  public onSelectRegularChange(regular: Entity & RegularValues): void {
    this._regular$.next(regular);
  }

  public regular$: Observable<Entity & RegularValues> = this._regular$.asObservable();

  public validRegular$: Observable<boolean> = this._regular$.asObservable().pipe(map(isValidRegular));

  public prefilledFare$: Observable<Partial<FareValues>> = this.regular$.pipe(
    filter(isValidRegular),
    map(initialFareValuesFromRegular)
  );

  public drivers$: Observable<DriverValues[]> = this._listDriversQuery$().pipe(map(toDriversValues));

  public onScheduleFareActionSuccess = (fares: FaresScheduled): void => {
    this.regularControl.reset();
    this.scheduleFareForm.reset();
    this._toaster.toast(toScheduleFareSuccessToast(fares));
  };

  public onScheduleFareActionError = (error: Error): void => {
    this._toaster.toast({
      content: `Échec de la planification de la course: ${error.name} | ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };
}
