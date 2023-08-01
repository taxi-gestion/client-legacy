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
import { SEARCH_PLACE_QUERY, SearchPlaceQuery, PlacePresentation } from '@features/common/place';
import { debounceTime, distinctUntilChanged, filter, map, Observable, Subject, switchMap } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-place-field',
  templateUrl: './place-field.component.html'
})
export class PlaceFieldComponent implements OnChanges {
  @Input() public minSearchTermLength: number = 3;
  @Input() public searchDebounceTime: number = 300;

  @Output() public readonly selectPlace: EventEmitter<PlacePresentation> = new EventEmitter<PlacePresentation>();

  @Output() public readonly resetPlace: EventEmitter<void> = new EventEmitter<void>();

  @Input() public placeNotFound: boolean = false;

  @Input() public displayReset: boolean = false;

  @Input() public defaultValue?: string;

  private readonly _searchPlaceTerm$: Subject<string> = new Subject<string>();

  public placesFound$: Observable<PlacePresentation[]> = this._searchPlaceTerm$.pipe(
    map((searchPlaceTerm: string): string => searchPlaceTerm.trim()),
    filter((searchPlaceTerm: string): boolean => searchPlaceTerm.length >= this.minSearchTermLength),
    debounceTime(this.searchDebounceTime),
    distinctUntilChanged(),
    switchMap((searchPlaceTerm: string): Observable<PlacePresentation[]> => this._searchPlaceQuery(searchPlaceTerm))
  );

  public constructor(@Inject(SEARCH_PLACE_QUERY) private readonly _searchPlaceQuery: SearchPlaceQuery) {}

  public formGroup: FormGroup = new FormGroup({ place: new FormControl() });

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    simpleChanges['defaultValue'] != null && this.formGroup.get('place')?.setValue(this.defaultValue ?? '');
  }

  public search(placeInput: string): void {
    this._searchPlaceTerm$.next(placeInput);
  }

  public setPlaceSuggestion(place: PlacePresentation): void {
    this.formGroup.get('place')?.setValue(place.label);
    this.selectPlace.next(place);
  }

  public trackByPlaceName(_: number, place: PlacePresentation): string {
    return `${place.label}-${place.context}`;
  }

  public clear(): void {
    this.formGroup.get('place')?.reset();
    this.resetPlace.emit();
  }
}
