import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, Observable, Subject, switchMap } from 'rxjs';
import { LIST_DRIVERS_QUERY, SearchDriverQuery } from '../../providers';
import { Driver, Entity } from '@definitions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-driver-field',
  templateUrl: './driver-field.component.html'
})
export class DriverFieldComponent implements OnChanges {
  @Input() public minSearchTermLength: number = 0;
  @Input() public searchDebounceTime: number = 300;

  @Output() public readonly selectDriver: EventEmitter<Driver & Entity> = new EventEmitter<Driver & Entity>();

  @Output() public readonly resetDriver: EventEmitter<void> = new EventEmitter<void>();

  @Input() public driverNotFound: boolean = false;

  @Input() public displayReset: boolean = false;

  @Input() public defaultValue?: string;

  private readonly _listDriversTerm$: Subject<string> = new Subject<string>();

  public driversFound$: Observable<(Driver & Entity)[]> = this._listDriversTerm$.pipe(
    map((listDriversTerm: string): string => listDriversTerm.trim()),
    filter((listDriversTerm: string): boolean => listDriversTerm.length >= this.minSearchTermLength),
    debounceTime(this.searchDebounceTime),
    distinctUntilChanged(),
    // TODO Add sort by term
    switchMap((listDriversTerm: string): Observable<(Driver & Entity)[]> => this._listDriversQuery(listDriversTerm))
  );

  public constructor(@Inject(LIST_DRIVERS_QUERY) private readonly _listDriversQuery: SearchDriverQuery) {}

  public formGroup: FormGroup = new FormGroup({ driver: new FormControl() });

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    simpleChanges['defaultValue'] != null && this.formGroup.get('driver')?.setValue(this.defaultValue ?? '');
  }

  public search(driverInput: string): void {
    this._listDriversTerm$.next(driverInput);
  }

  public setDriverSuggestion(driver: Driver & Entity): void {
    this.formGroup.get('driver')?.setValue(driver.identifier);
    this.selectDriver.next(driver);
  }

  public trackByDriverId(_: number, driver: Driver & Entity): string {
    return driver.id;
  }

  public clear(): void {
    this.formGroup.get('driver')?.reset();
    this.resetDriver.emit();
  }
}
