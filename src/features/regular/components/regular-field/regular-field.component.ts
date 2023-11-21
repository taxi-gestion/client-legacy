import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { firstnameOrEmpty, SEARCH_REGULAR_QUERY, SearchRegularQuery, toRegularsValues } from '@features/regular';
import { REGULAR_FORM_CONTROL_ERROR_MESSAGES } from '../../errors/form-errors-messages.token';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { selectedRegularValidator } from '../../validators';
import { RegularValues } from '../../definitions/regular.definition';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '@features/common/form-validation';
import { Entity } from '@definitions';
import { regularEmptyValue } from '../../common/regular.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-regular-field',
  templateUrl: './regular-field.component.html',
  providers: [
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: REGULAR_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class RegularFieldComponent {
  @Input({ required: true }) public regularFieldControl!: FormControl<Entity & RegularValues>;

  @Input() public prefilled: (Entity & RegularValues)[] = [];

  public searchFormGroup: FormGroup<{ search: FormControl<string> }> = new FormGroup<{ search: FormControl<string> }>({
    search: new FormControl<string>('', { nonNullable: true, validators: [] })
  });

  @Input() public set regular(regular: ((Entity & RegularValues) | undefined) | null) {
    regular !== null && this.onRegularReceived(regular ?? regularEmptyValue);
  }

  @Output() public readonly selectedValue: EventEmitter<Entity & RegularValues> = new EventEmitter<Entity & RegularValues>();

  @Output() public actionError: EventEmitter<Error> = new EventEmitter<Error>();

  public onSelectedValueChange(regular: Entity & RegularValues): void {
    this.regularFieldControl.setValue(regular);
    this.selectedValue.emit(regular);
  }

  public constructor(@Inject(SEARCH_REGULAR_QUERY) private readonly _searchRegularQuery: SearchRegularQuery) {}

  public onRegularReceived(regularNumberValue: (Entity & RegularValues) | undefined): void {
    this.defaultValue = regularNumberValue;
  }

  public defaultValue: (Entity & RegularValues) | undefined = regularEmptyValue;

  public regularEmptyValue: Entity & RegularValues = regularEmptyValue;

  public toSearchTerm = (regularValues: Entity & RegularValues): string =>
    `${regularValues.lastname} ${firstnameOrEmpty(regularValues)}`.trim();

  public toTrackBy: (index: number, regularValues: Entity & RegularValues) => string = (
    _: number,
    regularValues: Entity & RegularValues
  ): string => `${regularValues.id}`;

  public regularValuesValidator: (regularValues: (Entity & RegularValues) | undefined) => ValidatorFn =
    selectedRegularValidator;

  public query$ = (searchTerm: string): Observable<(Entity & RegularValues)[]> =>
    this._searchRegularQuery(searchTerm).pipe(map(toRegularsValues));
}
