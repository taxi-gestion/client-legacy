import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { bootstrapValidationClasses, BootstrapValidationClasses } from '@features/common/form-validation';
import { Entity, RegularHistory } from '../../../../definitions';
import { RegularValues } from '../../definitions';
import { regularEmptyValue } from '../../common/regular.presenter';
import { BehaviorSubject, combineLatest, filter, map, merge, Observable, of, switchMap } from 'rxjs';
import { regularHasId } from '../../validators';
import { REGULAR_HISTORY_QUERY, RegularHistoryQuery } from '../../providers';
import { RegularHistoryValues } from '../../common/regular.presentation';
import { routeParamToRegularId, toRegularHistoryValues } from './regular-history.presenter';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './regular-history.page.html'
})
export class RegularHistoryPage {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Output() public regularHistorySubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public regularHistorySuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public regularHistoryError: EventEmitter<Error> = new EventEmitter<Error>();

  public regularControl: FormControl<Entity & RegularValues> = new FormControl(regularEmptyValue, {
    nonNullable: true
  });

  public constructor(
    private readonly _route: ActivatedRoute,
    @Inject(REGULAR_HISTORY_QUERY) private readonly _regularHistoryQuery$: RegularHistoryQuery
  ) {}

  private readonly _regular$: BehaviorSubject<Entity & RegularValues> = new BehaviorSubject<Entity & RegularValues>(
    regularEmptyValue
  );

  public onSelectRegularChange(regular: Entity & RegularValues): void {
    this._regular$.next(regular);
  }

  public regularId$: Observable<string> = this._route.params.pipe(
    switchMap((params: Params): Observable<string | undefined> => of(routeParamToRegularId('id', params))),
    filter(Boolean)
  );

  public regular$: Observable<Entity & RegularValues> = this._regular$.asObservable();

  public validRegular$: Observable<boolean> = this._regular$
    .asObservable()
    .pipe(map((regular: Entity & RegularValues): boolean => regularHasId(regular)));

  public readonly triggerFromControl$: Observable<string> = combineLatest([this.regular$, this.validRegular$]).pipe(
    filter(([_, isValid]: [_: Entity & RegularValues, isValid: boolean]): boolean => isValid),
    map(([regular]: [regular: Entity & RegularValues, _: boolean]): string => regular.id)
  );

  public readonly regularHistory$: Observable<RegularHistoryValues> = merge(this.regularId$, this.triggerFromControl$).pipe(
    switchMap((regularId: string): Observable<RegularHistory> => this._regularHistoryQuery$(regularId)),
    map(toRegularHistoryValues)
  );
}
