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
import { PENDING_RETURNS_FOR_DATE_QUERY, PendingReturnsForDateQuery } from '../../../providers';
import { Entity, Pending } from '@definitions';
import { PendingPresentation, toPendingReturnsForDatePresentation } from '../../../common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pending-return-field',
  templateUrl: './pending-return-field.component.html'
})
export class PendingReturnFieldComponent implements OnChanges {
  @Input() public minSearchTermLength: number = 0;
  @Input() public searchDebounceTime: number = 300;
  @Input({ required: true }) public date!: string;

  @Output() public readonly selectPendingReturns: EventEmitter<PendingPresentation> = new EventEmitter<PendingPresentation>();

  @Output() public readonly resetPendingReturns: EventEmitter<void> = new EventEmitter<void>();

  @Input() public pendingReturnsNotFound: boolean = false;

  @Input() public displayReset: boolean = false;

  @Input() public defaultValue?: string;

  private readonly _searchPendingReturnsTerm$: Subject<string> = new Subject<string>();

  // TODO Add sort result by matching term
  public pendingReturnssFound$: Observable<PendingPresentation[]> = this._searchPendingReturnsTerm$.pipe(
    map((searchPendingReturnsTerm: string): string => searchPendingReturnsTerm.trim()),
    filter((searchPendingReturnsTerm: string): boolean => searchPendingReturnsTerm.length >= this.minSearchTermLength),
    debounceTime(this.searchDebounceTime),
    distinctUntilChanged(),
    switchMap((): Observable<(Entity & Pending)[]> => this._pendingReturnsForDateQuery(this.date)),
    map(toPendingReturnsForDatePresentation)
  );

  public formGroup: FormGroup = new FormGroup({ pendingReturns: new FormControl() });

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    simpleChanges['defaultValue'] != null && this.formGroup.get('pendingReturns')?.setValue(this.defaultValue ?? '');
  }

  public constructor(
    @Inject(PENDING_RETURNS_FOR_DATE_QUERY) private readonly _pendingReturnsForDateQuery: PendingReturnsForDateQuery
  ) {}

  public search(pendingReturnsInput: string): void {
    this._searchPendingReturnsTerm$.next(pendingReturnsInput);
  }

  public setPendingReturnsSuggestion(pendingReturns: PendingPresentation): void {
    this.formGroup.get('pendingReturns')?.setValue(pendingReturns.passenger);
    this.selectPendingReturns.next(pendingReturns);
  }

  public trackByPendingReturnsId(_: number, pendingReturns: PendingPresentation): string {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${pendingReturns.pendingReturnId}`;
  }

  public clear(): void {
    this.formGroup.get('pendingReturns')?.reset();
    this.resetPendingReturns.emit();
  }
}
