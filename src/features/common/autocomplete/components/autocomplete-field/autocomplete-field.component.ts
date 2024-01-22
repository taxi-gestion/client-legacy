import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormControl, FormControlStatus, FormGroup, ValidatorFn } from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  Observable,
  startWith,
  switchMap,
  tap
} from 'rxjs';
import { bootstrapValidationClasses, BootstrapValidationClasses } from '@features/common/form-validation';
import { AutocompleteResultsDropdownComponent } from '../autocomplete-results-dropdown/autocomplete-results-dropdown.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-autocomplete-field',
  templateUrl: './autocomplete-field.component.html'
})
export class AutocompleteFieldComponent<TValue> {
  @ContentChild('resultTemplate') public resultTemplate!: TemplateRef<unknown>;
  @ContentChild('selectedValueTemplate') public selectedValueTemplate!: TemplateRef<unknown>;

  @ViewChild('resultsDropdown') public resultsDropdown!: AutocompleteResultsDropdownComponent;

  @ViewChild('templatedInput') public searchInput!: ElementRef;

  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Input() public minSearchTermLength: number = 3;
  @Input() public searchDebounceTime: number = 300;
  @Input() public placeholder: string = 'Rechercher...';

  @Input({ required: true }) public emptyValue!: TValue;
  @Input({ required: true }) public toSearchTerm!: (value: TValue) => string;
  @Input({ required: true }) public toTrackBy!: (index: number, value: TValue) => string;
  @Input({ required: true }) public validator!: (value: TValue) => ValidatorFn;
  @Input({ required: true }) public formGroup!: FormGroup<{ search: FormControl<string> }>;

  @Input({ required: true }) public query$!: (search: string) => Observable<TValue[]>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() public addEntryTemplate: TemplateRef<any> | null = null;

  @Input() public resultFilter: (searchTerm: string) => (combinedResults: TValue[]) => TValue[] =
    (_search: string) =>
    (values: TValue[]): TValue[] =>
      values;

  @Input() public set setDefaultSelectedValue(value: (TValue | undefined) | null) {
    if (value === null || this.emptyValue === value) return;

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

  public onFocus(): void {
    this._prefilled$.next(this.prefilled);
  }

  @Output() public readonly selectedValue: EventEmitter<TValue> = new EventEmitter<TValue>();

  @Output() public actionError: EventEmitter<Error> = new EventEmitter<Error>();

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
    switchMap(
      (searchTerm: string): Observable<TValue[]> =>
        this.query$(searchTerm).pipe(
          catchError((error: Error): Observable<never> => {
            this.actionError.emit(error);
            return EMPTY;
          })
        )
    ),
    startWith([])
  );

  public found$: Observable<TValue[]> = combineLatest([this._prefilled$, this.foundFromSearch$]).pipe(
    map(([prefilled, foundFromSearch]: [TValue[], TValue[]]): TValue[] =>
      this.resultFilter(this._searchTerm$.getValue())([...prefilled, ...foundFromSearch])
    ),
    tap((values: TValue[]): void => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (this.resultsDropdown !== undefined && (values.length >= 1 || this.addEntryTemplate !== null))
        this.resultsDropdown.expand();
    })
  );

  public search(term: string): void {
    this._selected$.next(this.emptyValue);
    this.selectedValue.emit(this.emptyValue);
    this._searchTerm$.next(term);
  }

  public setSuggestion(value: TValue): void {
    this.formGroup.controls.search.setValue(this.toSearchTerm(value));
    this._selected$.next(value);
    this.selectedValue.emit(value);
  }

  public onClear(): void {
    this._searchTerm$.next('');
    this._selected$.next(this.emptyValue);
    this.formGroup.controls.search.reset();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.searchInput.nativeElement.blur();
  }
}
