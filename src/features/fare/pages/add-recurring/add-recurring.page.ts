import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { RECURRING_FARE_FORM } from '../fare.form';
import { toRecurringToAdd, toAddRecurringSuccessToast, toActionsSummary } from './add-recurring.presenter';
import { AddRecurring, Entity } from '@definitions';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { nullToUndefined } from '@features/common/form-validation';
import { driverEmptyValue, DriverValues, LIST_DRIVERS_QUERY, ListDriversQuery, toDriversValues } from '@features/common/driver';
import { isValidRegular, regularEmptyValue, RegularValues } from '@features/regular';
import { AddRecurringFields, FareValues, initialFareValuesFromRegular, RecurringToAddValues } from '@features/fare';
import { ActivatedRoute, Router } from '@angular/router';
import { ADD_RECURRING_ACTION, AddRecurringAction } from '../../providers/actions/add-recurring.action.provider';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-recurring.page.html'
})
export class AddRecurringPage {
  @Output() public addRecurringSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public addRecurringSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public addRecurringError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly addRecurring$ = (): Observable<AddRecurring> =>
    this._addRecurringAction$(
      toRecurringToAdd(
        nullToUndefined({
          ...this.addRecurringForm.value,
          passenger: { ...this.regularControl.value }
        })
      )
    );

  public readonly addRecurringForm: FormGroup<AddRecurringFields> = RECURRING_FARE_FORM;
  public regularControl: FormControl<Entity & RegularValues> = new FormControl(regularEmptyValue, { nonNullable: true });

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(ADD_RECURRING_ACTION) private readonly _addRecurringAction$: AddRecurringAction,
    @Inject(LIST_DRIVERS_QUERY) private readonly _listDriversQuery$: ListDriversQuery
  ) {
    this.addRecurringForm.controls.departureTime.setValue('12:00');
  }

  private readonly _regular$: BehaviorSubject<Entity & RegularValues> = new BehaviorSubject<Entity & RegularValues>(
    regularEmptyValue
  );

  public actionsSummary$: Observable<string[]> = this.addRecurringForm.valueChanges.pipe(map(toActionsSummary));

  public displayReturnTime$: Observable<boolean> = this.addRecurringForm.valueChanges.pipe(
    map((values: Partial<RecurringToAddValues>): boolean => values.isTwoWayDrive === true && values.driver !== driverEmptyValue)
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

  public onAddRecurringActionSuccess = async (fares: AddRecurring): Promise<void> => {
    this.regularControl.reset();
    this.addRecurringForm.reset();
    this._toaster.toast(toAddRecurringSuccessToast(fares));
    await this._router.navigate(['../../'], { relativeTo: this._route });
  };

  public onAddRecurringActionError = (error: Error): void => {
    this._toaster.toast({
      content: `Échec de l'ajout de la règle: ${error.name} | ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };
}
