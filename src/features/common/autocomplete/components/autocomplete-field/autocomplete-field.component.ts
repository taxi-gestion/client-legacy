import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { AbstractControl, FormControl, FormControlStatus, FormGroup, ValidatorFn } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  switchMap,
  tap
} from 'rxjs';
import { bootstrapValidationClasses, BootstrapValidationClasses } from '@features/common/form-validation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-autocomplete-field',
  templateUrl: './autocomplete-field.component.html'
})
export class AutocompleteFieldComponent<TValue> {
  @ContentChild('resultTemplate') public resultTemplate!: TemplateRef<unknown>;
  @ContentChild('selectedValueTemplate') public selectedValueTemplate!: TemplateRef<unknown>;

  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Input() public minSearchTermLength: number = 0;
  @Input() public searchDebounceTime: number = 300;
  @Input() public placeholder: string = 'Rechercher...';

  @Input({ required: true }) public emptyValue!: TValue;
  @Input({ required: true }) public toSearchTerm!: (value: TValue) => string;
  @Input({ required: true }) public toTrackBy!: (index: number, value: TValue) => string;
  @Input({ required: true }) public validator!: (value: TValue) => ValidatorFn;
  @Input({ required: true }) public query$!: (search: string) => Observable<TValue[]>;
  @Input({ required: true }) public formGroup!: FormGroup<{ search: FormControl<string> }>;

  @Input() public resultFilter: (searchTerm: string) => (combinedResults: TValue[]) => TValue[] =
    (_search: string) =>
    (values: TValue[]): TValue[] =>
      values;

  @Input() public set setDefaultSelectedValue(value: (TValue | undefined) | null) {
    if (value === null) return;

    if (value === undefined) this.formGroup.reset();

    value != null && this.setSuggestion(value);
  }

  @Input() public prefilled: TValue[] = [];

  @Input() public set revalidate(statusChange: { status: FormControlStatus | null; touched: boolean }) {
    if (statusChange.status === null || !statusChange.touched) return;
    this.formGroup.markAllAsTouched();
    this.formGroup.controls.search.setValidators(this.validator(this._selected$.getValue()));
    this.formGroup.controls.search.updateValueAndValidity();
  }

  private readonly _prefilled$: BehaviorSubject<TValue[]> = new BehaviorSubject<TValue[]>(this.prefilled);

  public initResults(): void {
    this._prefilled$.next(this.prefilled);
  }

  @Output() public readonly selectedValue: EventEmitter<TValue> = new EventEmitter<TValue>();

  private readonly _searchTerm$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private readonly _selected$: BehaviorSubject<TValue> = new BehaviorSubject<TValue>(this.emptyValue);

  public selected$: Observable<TValue> = this._selected$.asObservable().pipe(
    tap((value: TValue): void => {
      this.formGroup.controls.search.setValidators(this.validator(value));
      this.formGroup.controls.search.updateValueAndValidity();
    })
  );

  public foundFromSearch$: Observable<TValue[]> = this._searchTerm$.pipe(
    map((searchTerm: string): string => searchTerm.trim()),
    filter((searchTerm: string): boolean => searchTerm.length >= this.minSearchTermLength),
    debounceTime(this.searchDebounceTime),
    distinctUntilChanged(),
    switchMap((searchTerm: string): Observable<TValue[]> => this.query$(searchTerm))
  );

  public found$: Observable<TValue[]> = combineLatest([this._prefilled$, this.foundFromSearch$]).pipe(
    map(([prefilled, foundFromSearch]: [TValue[], TValue[]]): TValue[] =>
      this.resultFilter(this._searchTerm$.getValue())([...prefilled, ...foundFromSearch])
    )
  );

  public search(term: string): void {
    this._searchTerm$.next(term);
    this._selected$.next(this.emptyValue);
  }

  public setSuggestion(value: TValue): void {
    this.formGroup.controls.search.setValue(this.toSearchTerm(value));
    this._selected$.next(value);
    this.selectedValue.emit(value);
  }
}
