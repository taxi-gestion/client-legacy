import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { SEARCH_PLACE_QUERY, SearchPlaceQuery } from '../../providers';
import { PLACE_FORM_CONTROL_ERROR_MESSAGES } from '../../errors/form-errors-messages.token';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { selectedPlaceValidator } from '../../validators';
import { placeEmptyValue } from '../../place.presenter';
import { PlaceValues } from '../../definitions/place.definition';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '@features/common/form-validation';

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
  @Input({ required: true }) public placeFieldControl!: FormControl<PlaceValues>;

  @Input() public prefilled: PlaceValues[] = [];

  public searchFormGroup: FormGroup<{ search: FormControl<string> }> = new FormGroup<{ search: FormControl<string> }>({
    search: new FormControl<string>('', { nonNullable: true, validators: [] })
  });

  @Input() public set place(place: (PlaceValues | undefined) | null) {
    place !== null && this.onPlaceReceived(place ?? placeEmptyValue);
  }

  @Output() public readonly selectedValue: EventEmitter<PlaceValues> = new EventEmitter<PlaceValues>();

  public onSelectedValueChange(place: PlaceValues): void {
    this.placeFieldControl.setValue(place);
    this.selectedValue.emit(place);
  }

  public constructor(@Inject(SEARCH_PLACE_QUERY) private readonly _searchPlaceQuery: SearchPlaceQuery) {}

  public onPlaceReceived(placeNumberValue: PlaceValues | undefined): void {
    this.defaultValue = placeNumberValue;
  }

  public defaultValue: PlaceValues | undefined = placeEmptyValue;

  public placeEmptyValue: PlaceValues = placeEmptyValue;

  public toSearchTerm = (placeValues: PlaceValues): string => placeValues.label;

  public toTrackBy: (index: number, placeValues: PlaceValues) => string = (_: number, placeValues: PlaceValues): string =>
    `${placeValues.context}${placeValues.location.latitude}${placeValues.location.longitude}`;

  public placeValuesValidator: (placeValues: PlaceValues | undefined) => ValidatorFn = selectedPlaceValidator;

  public query$ = (searchTerm: string): Observable<PlaceValues[]> => this._searchPlaceQuery(searchTerm);
}
