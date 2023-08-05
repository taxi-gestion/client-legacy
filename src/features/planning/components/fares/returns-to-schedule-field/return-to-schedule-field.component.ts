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
import { RETURNS_TO_SCHEDULE_FOR_DATE_QUERY, ReturnsToScheduleForDateQuery } from '../../../providers';
import { PendingReturnToSchedule } from '@domain';

import {
  ReturnToScheduleWithPassengerPresentation,
  toReturnsToScheduleWithPassengerForDatePresentation
} from './returns-to-schedule.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-return-to-schedule-field',
  templateUrl: './return-to-schedule-field.component.html'
})
export class ReturnToScheduleFieldComponent implements OnChanges {
  @Input() public minSearchTermLength: number = 0;
  @Input() public searchDebounceTime: number = 300;
  @Input({ required: true }) public date!: string;

  @Output() public readonly selectReturnToSchedule: EventEmitter<ReturnToScheduleWithPassengerPresentation> =
    new EventEmitter<ReturnToScheduleWithPassengerPresentation>();

  @Output() public readonly resetReturnToSchedule: EventEmitter<void> = new EventEmitter<void>();

  @Input() public returnToScheduleNotFound: boolean = false;

  @Input() public displayReset: boolean = false;

  @Input() public defaultValue?: string;

  private readonly _searchReturnToScheduleTerm$: Subject<string> = new Subject<string>();

  // TODO Add sort result by matching term
  public returnToSchedulesFound$: Observable<ReturnToScheduleWithPassengerPresentation[]> =
    this._searchReturnToScheduleTerm$.pipe(
      map((searchReturnToScheduleTerm: string): string => searchReturnToScheduleTerm.trim()),
      filter((searchReturnToScheduleTerm: string): boolean => searchReturnToScheduleTerm.length >= this.minSearchTermLength),
      debounceTime(this.searchDebounceTime),
      distinctUntilChanged(),
      switchMap((): Observable<PendingReturnToSchedule[]> => this._returnsToScheduleForDateQuery(this.date)),
      map(toReturnsToScheduleWithPassengerForDatePresentation)
    );

  public formGroup: FormGroup = new FormGroup({ returnToSchedule: new FormControl() });

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    simpleChanges['defaultValue'] != null && this.formGroup.get('returnToSchedule')?.setValue(this.defaultValue ?? '');
  }

  public constructor(
    @Inject(RETURNS_TO_SCHEDULE_FOR_DATE_QUERY) private readonly _returnsToScheduleForDateQuery: ReturnsToScheduleForDateQuery
  ) {}

  public search(returnToScheduleInput: string): void {
    this._searchReturnToScheduleTerm$.next(returnToScheduleInput);
  }

  public setReturnToScheduleSuggestion(returnToSchedule: ReturnToScheduleWithPassengerPresentation): void {
    this.formGroup.get('returnToSchedule')?.setValue(returnToSchedule.passenger);
    this.selectReturnToSchedule.next(returnToSchedule);
  }

  public trackByReturnToScheduleId(_: number, returnToSchedule: ReturnToScheduleWithPassengerPresentation): string {
    return `${returnToSchedule.returnToScheduleId}`;
  }

  public clear(): void {
    this.formGroup.get('returnToSchedule')?.reset();
    this.resetReturnToSchedule.emit();
  }
}
