import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { toLongDateFormat, toStandardDateFormat } from '@features/common/angular';
import { DateService } from '@features/common/date';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { FARES_COUNT_FOR_DATE_QUERY, FaresCountForDateQuery } from '@features/fare';
import { FaresCount } from '../../../../definitions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-fare.layout.html'
})
export class ManageFareLayout {
  public selectedDate$: Observable<Date> = this._date.date$();
  public userFriendlyDate$: Observable<string> = this.selectedDate$.pipe(map(toLongDateFormat));

  public fareCounts$: Observable<FaresCount> = this.selectedDate$.pipe(
    switchMap((date: Date): Observable<FaresCount> => this._faresForDateQuery(toStandardDateFormat(date))),
    catchError((error: Error): Observable<FaresCount> => {
      this._toaster.toast({
        content: `Échec de la récupération du nombre de courses : ${error.name} | ${error.message}`,
        status: 'danger',
        title: 'Opération échouée'
      });
      return of({
        scheduled: 0,
        pending: 0,
        unassigned: 0,
        subcontracted: 0
      });
    })
  );

  public constructor(
    private readonly _date: DateService,
    private readonly _toaster: ToasterPresenter,
    @Inject(FARES_COUNT_FOR_DATE_QUERY) private readonly _faresForDateQuery: FaresCountForDateQuery //@Inject(PENDING_RETURNS_FOR_DATE_QUERY) private readonly _pendingReturnsForDateQuery: PendingReturnsForDateQuery
  ) {}
}
