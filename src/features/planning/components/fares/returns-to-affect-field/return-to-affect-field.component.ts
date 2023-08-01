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
import { ReturnToAffectForDatePresentation } from '../../../common/returns-to-affect.presentation';
import { toReturnsToAffectForDatePresentation } from '../../../common/returns-to-affect.presenter';
import { RETURNS_TO_AFFECT_FOR_DATE_QUERY, ReturnsToAffectForDateQuery, ReturnToAffectForDate } from '../../../providers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-return-to-affect-field',
  templateUrl: './return-to-affect-field.component.html'
})
export class ReturnToAffectFieldComponent implements OnChanges {
  @Input() public minSearchTermLength: number = 0;
  @Input() public searchDebounceTime: number = 300;
  @Input({ required: true }) public date!: Date;

  @Output() public readonly selectReturnToAffect: EventEmitter<ReturnToAffectForDatePresentation> =
    new EventEmitter<ReturnToAffectForDatePresentation>();

  @Output() public readonly resetReturnToAffect: EventEmitter<void> = new EventEmitter<void>();

  @Input() public returnToAffectNotFound: boolean = false;

  @Input() public displayReset: boolean = false;

  @Input() public defaultValue?: string;

  private readonly _searchReturnToAffectTerm$: Subject<string> = new Subject<string>();

  // TODO Add sort result by matching term
  public returnToAffectsFound$: Observable<ReturnToAffectForDatePresentation[]> = this._searchReturnToAffectTerm$.pipe(
    map((searchReturnToAffectTerm: string): string => searchReturnToAffectTerm.trim()),
    filter((searchReturnToAffectTerm: string): boolean => searchReturnToAffectTerm.length >= this.minSearchTermLength),
    debounceTime(this.searchDebounceTime),
    distinctUntilChanged(),
    switchMap((): Observable<ReturnToAffectForDate[]> => this._returnsToAffectForDateQuery(this.date)),
    map(toReturnsToAffectForDatePresentation)
  );

  public formGroup: FormGroup = new FormGroup({ returnToAffect: new FormControl() });

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    simpleChanges['defaultValue'] != null && this.formGroup.get('returnToAffect')?.setValue(this.defaultValue ?? '');
  }

  public constructor(
    @Inject(RETURNS_TO_AFFECT_FOR_DATE_QUERY) private readonly _returnsToAffectForDateQuery: ReturnsToAffectForDateQuery
  ) {}

  public search(returnToAffectInput: string): void {
    this._searchReturnToAffectTerm$.next(returnToAffectInput);
  }

  public setReturnToAffectSuggestion(returnToAffect: ReturnToAffectForDatePresentation): void {
    this.formGroup.get('returnToAffect')?.setValue(returnToAffect.client);
    this.selectReturnToAffect.next(returnToAffect);
  }

  public trackByReturnToAffectId(_: number, returnToAffect: ReturnToAffectForDatePresentation): string {
    return `${returnToAffect.id}`;
  }

  public clear(): void {
    this.formGroup.get('returnToAffect')?.reset();
    this.resetReturnToAffect.emit();
  }
}
