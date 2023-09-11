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
import { SEARCH_REGULAR_QUERY, SearchRegularQuery } from '../../providers';
import { Entity, RegularDetails } from '@definitions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-regular-field',
  templateUrl: './regular-field.component.html'
})
export class RegularFieldComponent implements OnChanges {
  @Input() public minSearchTermLength: number = 2;
  @Input() public searchDebounceTime: number = 300;

  @Output() public readonly selectRegular: EventEmitter<Entity & RegularDetails> = new EventEmitter<Entity & RegularDetails>();

  @Output() public readonly searchRegularTerm: EventEmitter<string> = new EventEmitter<string>();

  @Output() public readonly resetRegular: EventEmitter<void> = new EventEmitter<void>();

  @Input() public regularNotFound: boolean = false;

  @Input() public displayReset: boolean = false;

  @Input() public defaultValue?: string;

  private readonly _searchRegularTerm$: Subject<string> = new Subject<string>();

  public regularsFound$: Observable<(Entity & RegularDetails)[]> = this._searchRegularTerm$.pipe(
    map((searchRegularTerm: string): string => searchRegularTerm.trim()),
    filter((searchRegularTerm: string): boolean => searchRegularTerm.length >= this.minSearchTermLength),
    debounceTime(this.searchDebounceTime),
    distinctUntilChanged(),
    switchMap(
      (searchRegularTerm: string): Observable<(Entity & RegularDetails)[]> => this._searchRegularQuery(searchRegularTerm)
    )
  );

  public constructor(@Inject(SEARCH_REGULAR_QUERY) private readonly _searchRegularQuery: SearchRegularQuery) {}

  public formGroup: FormGroup = new FormGroup({ regular: new FormControl() });

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    simpleChanges['defaultValue'] != null && this.formGroup.get('regular')?.setValue(this.defaultValue ?? '');
  }

  public search(regularInput: string): void {
    this._searchRegularTerm$.next(regularInput);
    this.searchRegularTerm.next(regularInput);
  }

  public setRegularSuggestion(regular: Entity & RegularDetails): void {
    this.formGroup
      .get('regular')
      ?.setValue(`${regular.lastname}${regular.firstname === undefined ? '' : ` ${regular.firstname}`}`);
    this.selectRegular.next(regular);
  }

  public trackByRegularName(_: number, regular: RegularDetails): string {
    return `${regular.lastname} ${regular.firstname}`;
  }

  public clear(): void {
    this.formGroup.get('regular')?.reset();
    this.resetRegular.emit();
  }
}
