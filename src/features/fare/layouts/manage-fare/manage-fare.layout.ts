import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Entity, Pending, Scheduled } from '@definitions';
import { toLongDateFormat, toStandardDateFormat } from '@features/common/angular';
import { DateService } from '@features/common/date';
import {
  PENDING_RETURNS_FOR_DATE_QUERY,
  PendingReturnsForDateQuery,
  PendingReturnValues,
  SCHEDULED_FARES_FOR_DATE_QUERY,
  ScheduledFaresForDateQuery,
  ScheduledFareValues,
  toPendingReturnsValues,
  toScheduledFaresValues
} from '@features/fare';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-fare.layout.html'
})
export class ManageFareLayout {
  public selectedDate$: Observable<Date> = this._date.date$();
  public userFriendlyDate$: Observable<string> = this.selectedDate$.pipe(map(toLongDateFormat));

  public readonly scheduledFares$: Observable<ScheduledFareValues[]> = this.selectedDate$.pipe(
    switchMap((date: Date): Observable<(Entity & Scheduled)[]> => this._faresForDateQuery(toStandardDateFormat(date))),
    map(toScheduledFaresValues),
    catchError((error: Error): Observable<ScheduledFareValues[]> => {
      this._toaster.toast({
        content: `Échec de la récupération des courses : ${error.name} | ${error.message}`,
        status: 'danger',
        title: 'Opération échouée'
      });
      return of([]);
    })
  );

  public readonly pendingReturns$: Observable<PendingReturnValues[]> = this.selectedDate$.pipe(
    switchMap((date: Date): Observable<(Entity & Pending)[]> => this._pendingReturnsForDateQuery(toStandardDateFormat(date))),
    map(toPendingReturnsValues),
    catchError((error: Error): Observable<PendingReturnValues[]> => {
      this._toaster.toast({
        content: `Échec de la récupération des retours : ${error.name} | ${error.message}`,
        status: 'danger',
        title: 'Opération échouée'
      });
      return of([]);
    })
  );

  public constructor(
    private readonly _date: DateService,
    private readonly _toaster: ToasterPresenter,
    @Inject(SCHEDULED_FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: ScheduledFaresForDateQuery,
    @Inject(PENDING_RETURNS_FOR_DATE_QUERY) private readonly _pendingReturnsForDateQuery: PendingReturnsForDateQuery
  ) {}
}
