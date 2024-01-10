/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, map, Observable, of, startWith, Subject } from 'rxjs';
import { DELETE_FARE_ACTION, DeleteFareAction } from '../../providers';
import { DeleteFare } from '@definitions';
import { Toast, ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { AbstractControl } from '@angular/forms';
import { bootstrapValidationClasses, BootstrapValidationClasses } from '@features/common/form-validation';
import { ActivatedRoute, Router } from '@angular/router';
import { RECURRING_FARES_QUERY, RecurringFaresQuery } from '../../providers/queries/recurring-fares.query.provider';

import { RecurringPresentation, toDeleteFareSuccessToasts } from '../../presentation';
import { toFilteredRecurringPresentation } from './edit-recurring.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-recurring.page.html'
})
export class EditRecurringPage {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Output() public editRecurringSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() public editRecurringSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() public editRecurringError: EventEmitter<Error> = new EventEmitter<Error>();

  private readonly _filterTerm$: Subject<string> = new Subject<string>();
  public filterTerm$: Observable<string> = this._filterTerm$
    .asObservable()
    .pipe(startWith(''), debounceTime(150), distinctUntilChanged());

  public readonly recurringFares$: Observable<RecurringPresentation[]> = combineLatest([
    this._recurringFaresForDateQuery(),
    this.filterTerm$
  ]).pipe(
    map(toFilteredRecurringPresentation),
    catchError((error: Error): Observable<RecurringPresentation[]> => {
      this._toaster.toast({
        content: `Échec de la récupération des courses : ${error.name} | ${error.message}`,
        status: 'danger',
        title: 'Opération échouée'
      });
      return of([]);
    })
  );

  public onFilterChange(filterEvent: Event): void {
    this._filterTerm$.next((filterEvent.target as HTMLInputElement).value);
  }

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(RECURRING_FARES_QUERY) private readonly _recurringFaresForDateQuery: RecurringFaresQuery,
    @Inject(DELETE_FARE_ACTION) private readonly _deleteFareAction$: DeleteFareAction
  ) {}

  //region delete
  public readonly deleteFare$$ = (id: string) => (): Observable<DeleteFare> => this._deleteFareAction$(id);

  public onDeleteFareActionSuccess = async (payload: DeleteFare): Promise<void> => {
    toDeleteFareSuccessToasts(payload).forEach((toast: Toast): void => {
      this._toaster.toast(toast);
    });
    await this._router.navigate(['../'], { relativeTo: this._route });
  };

  public onDeleteFareActionError = (_error: Error): void => {
    this._toaster.toast({ content: 'Échec de la suppression', status: 'danger', title: 'Opération échouée' });
  };
  //endregion
}
