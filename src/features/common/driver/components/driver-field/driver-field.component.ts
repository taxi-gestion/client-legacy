import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { LIST_DRIVERS_QUERY, ListDriversQuery } from '@features/common/driver';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable, Subject, take, tap } from 'rxjs';
import { Driver, Entity } from '@definitions';
import { bootstrapValidationClasses, BootstrapValidationClasses, FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '@features/common';
import { DRIVER_FORM_CONTROL_ERROR_MESSAGES } from '../../errors/form-errors-messages.token';
import { filterOnDriverUsername } from './driver-field.presenter';
import { selectedDriverValidator } from '../../validators/driver-validator.validator';

export type DriverValues = {
  driver: string;
};
export type DriverFields = {
  driver: FormControl<DriverValues['driver']>;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-driver-field',
  templateUrl: './driver-field.component.html',
  providers: [
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: DRIVER_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class DriverFieldComponent {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Input() public minSearchTermLength: number = 2;
  @Input() public searchDebounceTime: number = 300;

  @Output() public readonly selectDriver: EventEmitter<Driver & Entity> = new EventEmitter<Driver & Entity>();

  @Output() public readonly resetDriver: EventEmitter<void> = new EventEmitter<void>();

  @Input() public driverNotFound: boolean = false;

  @Input() public displayReset: boolean = false;

  @Input() public set defaultValue(driver: ((Driver & Entity) | undefined) | null) {
    driver != null && this.setDriverSuggestion(driver);
  }

  private readonly _searchDriverTerm$: Subject<string> = new Subject<string>();

  public searchDriverTerm$: Observable<string> = this._searchDriverTerm$.pipe(
    map((searchDriverTerm: string): string => searchDriverTerm.trim()),
    filter((searchDriverTerm: string): boolean => searchDriverTerm.length >= this.minSearchTermLength),
    distinctUntilChanged()
  );

  private readonly _selectedDriver$: BehaviorSubject<Driver & Entity> = new BehaviorSubject<Driver & Entity>(emptyDriverValue);

  public driversList$: Observable<(Driver & Entity)[]> = this._listDriversQuery().pipe(take(1));

  public selectedDriver$: Observable<Driver & Entity> = combineLatest([
    this._selectedDriver$.asObservable(),
    this.driversList$
  ]).pipe(
    tap(([driver, drivers]: [Driver & Entity, (Driver & Entity)[]]): void => {
      this.formGroup.controls.driver.setValidators(selectedDriverValidator(driver, drivers));
      this.formGroup.controls.driver.updateValueAndValidity();
    }),
    map(([driver, _]: [Driver & Entity, (Driver & Entity)[]]): Driver & Entity => driver)
  );

  public driversFound$: Observable<(Driver & Entity)[]> = combineLatest([this.searchDriverTerm$, this.driversList$]).pipe(
    map(filterOnDriverUsername)
  );

  public constructor(@Inject(LIST_DRIVERS_QUERY) private readonly _listDriversQuery: ListDriversQuery) {}

  public readonly formGroup: FormGroup<DriverFields> = new FormGroup<DriverFields>({
    driver: new FormControl<DriverValues['driver']>('', {
      nonNullable: true,
      validators: []
    })
  });

  public search(driverInput: string): void {
    this._searchDriverTerm$.next(driverInput);
    this._selectedDriver$.next(emptyDriverValue);
  }

  public setDriverSuggestion(driver: Driver & Entity): void {
    this.formGroup.get('driver')?.setValue(driver.username);
    this._selectedDriver$.next(driver);
    this.selectDriver.emit(driver);
  }

  public trackByDriverId(_: number, driver: Driver & Entity): string {
    return `${driver.id}`;
  }

  public clear(): void {
    this.formGroup.get('driver')?.reset();
    this.resetDriver.emit();
  }
}

const emptyDriverValue: Driver & Entity = {
  id: '',
  username: '',
  identifier: ''
};
