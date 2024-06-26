import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { DeleteFare, Entity, Subcontracted } from '@definitions';
import { AbstractControl } from '@angular/forms';
import { bootstrapValidationClasses, BootstrapValidationClasses } from '@features/common/form-validation';
import {
  SUBCONTRACTED_FARES_QUERY,
  SubcontractedFaresQuery
} from '../../providers/queries/subcontracted-fares-for-date.query.provider';
import { DateService } from '../../../common/date';
import { toLongDateFormat, toStandardDateFormat } from '../../../common/angular';
import { SubcontractedPresentation, toSubcontractedPresentation } from './subcontracted-fares.presenter';
import { sortByDatetime } from '../../../common/presentation/sort.presenter';
import { toDeleteFareSuccessToasts } from '../../presentation';
import { Toast, ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { DELETE_FARE_ACTION, DeleteFareAction } from '../../providers';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subcontracted-fares.page.html'
})
export class SubcontractedPage {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Output() public editRecurringSubmitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() public editRecurringSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() public editRecurringError: EventEmitter<Error> = new EventEmitter<Error>();

  public selectedDate$: Observable<Date> = this._date.date$();
  public userFriendlyDate$: Observable<string> = this.selectedDate$.pipe(map(toLongDateFormat));

  public readonly subcontractedFares$: Observable<SubcontractedPresentation[]> = this.selectedDate$.pipe(
    switchMap(
      (date: Date): Observable<(Entity & Subcontracted)[]> => this._subcontractedFaresForDateQuery(toStandardDateFormat(date))
    ),
    map((fares: (Entity & Subcontracted)[]): SubcontractedPresentation[] => sortByDatetime(toSubcontractedPresentation(fares)))
  );

  public constructor(
    private readonly _date: DateService,
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(SUBCONTRACTED_FARES_QUERY) private readonly _subcontractedFaresForDateQuery: SubcontractedFaresQuery,
    @Inject(DELETE_FARE_ACTION) private readonly _deleteFareAction$: DeleteFareAction
  ) {}

  //endregion

  //region delete
  public readonly deleteFare$$ = (id: string) => (): Observable<DeleteFare> => this._deleteFareAction$(id);

  public onDeleteFareActionSuccess = async (payload: DeleteFare): Promise<void> => {
    toDeleteFareSuccessToasts(payload).forEach((toast: Toast): void => {
      this._toaster.toast(toast);
    });
    await this._router.navigate(['../../'], { relativeTo: this._route });
  };

  public onDeleteFareActionError = (_error: Error): void => {
    this._toaster.toast({ content: 'Échec de la suppression', status: 'danger', title: 'Opération échouée' });
  };
  //endregion
}
