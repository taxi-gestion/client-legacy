import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { SEARCH_PLACE_QUERY, SearchPlaceQuery } from '@features/common/place';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { Place } from '@definitions';
import { bootstrapValidationClasses, BootstrapValidationClasses, FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '@features/common';
import { placeValidator } from './place-validator.validator';
import { PLACE_FORM_CONTROL_ERROR_MESSAGES } from '../../errors/form-errors-messages.token';

export type PlaceValues = {
  place: string;
};
export type PlaceFields = {
  place: FormControl<PlaceValues['place']>;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-place-field',
  templateUrl: './place-field.component.html',
  providers: [
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: PLACE_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class PlaceFieldComponent {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Input() public minSearchTermLength: number = 3;
  @Input() public searchDebounceTime: number = 300;

  @Output() public readonly selectPlace: EventEmitter<Place> = new EventEmitter<Place>();

  @Output() public readonly resetPlace: EventEmitter<void> = new EventEmitter<void>();

  @Input() public placeNotFound: boolean = false;

  @Input() public displayReset: boolean = false;

  @Input() public set defaultValue(place: (Place | undefined) | null) {
    place != null && this.setPlaceSuggestion(place);
  }

  private readonly _searchPlaceTerm$: Subject<string> = new Subject<string>();

  private readonly _selectedPlace$: BehaviorSubject<Place> = new BehaviorSubject<Place>(emptyPlaceValue);

  public selectedPlace$: Observable<Place> = this._selectedPlace$.asObservable().pipe(
    tap((place: Place): void => {
      this.formGroup.controls.place.setValidators(placeValidator(place));
      this.formGroup.controls.place.updateValueAndValidity();
    })
  );

  public placesFound$: Observable<Place[]> = this._searchPlaceTerm$.pipe(
    map((searchPlaceTerm: string): string => searchPlaceTerm.trim()),
    filter((searchPlaceTerm: string): boolean => searchPlaceTerm.length >= this.minSearchTermLength),
    debounceTime(this.searchDebounceTime),
    distinctUntilChanged(),
    switchMap((searchPlaceTerm: string): Observable<Place[]> => this._searchPlaceQuery(searchPlaceTerm))
  );

  public constructor(@Inject(SEARCH_PLACE_QUERY) private readonly _searchPlaceQuery: SearchPlaceQuery) {}

  public readonly formGroup: FormGroup<PlaceFields> = new FormGroup<PlaceFields>({
    place: new FormControl<PlaceValues['place']>('', {
      nonNullable: true,
      validators: []
    })
  });

  public search(placeInput: string): void {
    this._searchPlaceTerm$.next(placeInput);
    this._selectedPlace$.next(emptyPlaceValue);
  }

  public setPlaceSuggestion(place: Place): void {
    this.formGroup.get('place')?.setValue(place.context);
    this._selectedPlace$.next(place);
    this.selectPlace.emit(place);
  }

  public trackByPlaceName(_: number, place: Place): string {
    return `${place.label}-${place.context}`;
  }

  public clear(): void {
    this.formGroup.get('place')?.reset();
    this.resetPlace.emit();
  }
}

const emptyPlaceValue: Place = {
  context: '',
  label: '',
  location: {
    latitude: NaN,
    longitude: NaN
  }
};
