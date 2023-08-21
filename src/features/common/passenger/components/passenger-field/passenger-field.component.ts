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
import { SEARCH_PASSENGER_QUERY, SearchPassengerQuery } from '../../providers';
import { Passenger } from '@domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-passenger-field',
  templateUrl: './passenger-field.component.html'
})
export class PassengerFieldComponent implements OnChanges {
  @Input() public minSearchTermLength: number = 2;
  @Input() public searchDebounceTime: number = 300;

  @Output() public readonly selectPassenger: EventEmitter<Passenger> = new EventEmitter<Passenger>();

  @Output() public readonly searchPassengerTerm: EventEmitter<string> = new EventEmitter<string>();

  @Output() public readonly resetPassenger: EventEmitter<void> = new EventEmitter<void>();

  @Input() public passengerNotFound: boolean = false;

  @Input() public displayReset: boolean = false;

  @Input() public defaultValue?: string;

  private readonly _searchPassengerTerm$: Subject<string> = new Subject<string>();

  public passengersFound$: Observable<Passenger[]> = this._searchPassengerTerm$.pipe(
    map((searchPassengerTerm: string): string => searchPassengerTerm.trim()),
    filter((searchPassengerTerm: string): boolean => searchPassengerTerm.length >= this.minSearchTermLength),
    debounceTime(this.searchDebounceTime),
    distinctUntilChanged(),
    switchMap((searchPassengerTerm: string): Observable<Passenger[]> => this._searchPassengerQuery(searchPassengerTerm))
  );

  public constructor(@Inject(SEARCH_PASSENGER_QUERY) private readonly _searchPassengerQuery: SearchPassengerQuery) {}

  public formGroup: FormGroup = new FormGroup({ passenger: new FormControl() });

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    simpleChanges['defaultValue'] != null && this.formGroup.get('passenger')?.setValue(this.defaultValue ?? '');
  }

  public search(passengerInput: string): void {
    this._searchPassengerTerm$.next(passengerInput);
    this.searchPassengerTerm.next(passengerInput);
  }

  public setPassengerSuggestion(passenger: Passenger): void {
    this.formGroup.get('passenger')?.setValue(passenger.passenger);
    this.selectPassenger.next(passenger);
  }

  public trackByPassengerName(_: number, passenger: Passenger): string {
    return passenger.passenger;
  }

  public clear(): void {
    this.formGroup.get('passenger')?.reset();
    this.resetPassenger.emit();
  }
}
