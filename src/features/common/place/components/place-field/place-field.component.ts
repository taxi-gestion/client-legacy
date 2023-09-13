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
import { SEARCH_PLACE_QUERY, SearchPlaceQuery } from '@features/common/place';
import { debounceTime, distinctUntilChanged, filter, map, Observable, Subject, switchMap } from 'rxjs';
import { Place } from '@definitions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-place-field',
  templateUrl: './place-field.component.html'
})
export class PlaceFieldComponent implements OnChanges {
  @Input() public minSearchTermLength: number = 3;
  @Input() public searchDebounceTime: number = 300;

  @Output() public readonly selectPlace: EventEmitter<Place> = new EventEmitter<Place>();

  @Output() public readonly resetPlace: EventEmitter<void> = new EventEmitter<void>();

  @Input() public placeNotFound: boolean = false;

  @Input() public displayReset: boolean = false;

  @Input() public defaultValue?: (Place | string | undefined) | null;

  private readonly _searchPlaceTerm$: Subject<string> = new Subject<string>();

  public placesFound$: Observable<Place[]> = this._searchPlaceTerm$.pipe(
    map((searchPlaceTerm: string): string => searchPlaceTerm.trim()),
    filter((searchPlaceTerm: string): boolean => searchPlaceTerm.length >= this.minSearchTermLength),
    debounceTime(this.searchDebounceTime),
    distinctUntilChanged(),
    switchMap((searchPlaceTerm: string): Observable<Place[]> => this._searchPlaceQuery(searchPlaceTerm))
  );

  public constructor(@Inject(SEARCH_PLACE_QUERY) private readonly _searchPlaceQuery: SearchPlaceQuery) {}

  public formGroup: FormGroup = new FormGroup({ place: new FormControl() });

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    simpleChanges['defaultValue'] != null && this.formGroup.get('place')?.setValue(toPlaceString(this.defaultValue));
  }

  public search(placeInput: string): void {
    this._searchPlaceTerm$.next(placeInput);
  }

  public setPlaceSuggestion(place: Place): void {
    this.formGroup.get('place')?.setValue(place.label);
    this.selectPlace.next(place);
  }

  public trackByPlaceName(_: number, place: Place): string {
    return `${place.label}-${place.context}`;
  }

  public clear(): void {
    this.formGroup.get('place')?.reset();
    this.resetPlace.emit();
  }
}

const toPlaceString = (placeOrString: Place | string | null | undefined): string =>
  // eslint-disable-next-line no-nested-ternary
  placeOrString == null ? '' : typeof placeOrString === 'string' ? placeOrString : placeOrString.context;
