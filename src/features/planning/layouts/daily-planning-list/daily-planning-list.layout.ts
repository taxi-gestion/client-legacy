import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, combineLatest, map, Observable, of, switchMap, take } from 'rxjs';
import { toDailyDriverPlanning } from '../../common/fares.presenter';
import { Driver, DriverWithOrder, Entity, Scheduled } from '@definitions';
import { LIST_DRIVERS_WITH_ORDER_QUERY, ListDriversWithOrderQuery, sortDriversByDisplayOrder } from '@features/common/driver';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { DailyDriverPlanningListPresentation, toDailyDriverPlanningListPresentation } from './daily-planning-list.presenter';
import { SCHEDULED_FARES_FOR_DATE_QUERY, ScheduledFaresForDateQuery } from '@features/fare';
import { toStandardDateFormat } from '@features/common/angular';
import { DailyDriverPlanning } from '../../common/agenda.presenter';
import { DateService } from '../../../common/date';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily-planning-list.layout.html'
})
export class DailyPlanningListLayout {
  public selectedDate$: Observable<Date> = this._date.date$();

  public readonly drivers$: Observable<(Driver & Entity)[]> = of([]).pipe(
    switchMap((): Observable<DriverWithOrder[]> => this._listDriversWithOrderQuery()),
    map(sortDriversByDisplayOrder),
    take(1)
  );

  public readonly scheduledFares$: Observable<(Entity & Scheduled)[]> = this.selectedDate$.pipe(
    switchMap((date: Date): Observable<(Entity & Scheduled)[]> => this._faresForDateQuery(toStandardDateFormat(date))),
    catchError((error: Error): Observable<(Entity & Scheduled)[]> => {
      this._toaster.toast({
        content: `Échec de la récupération des courses : ${error.name} | ${error.message}`,
        status: 'danger',
        title: 'Opération échouée'
      });
      return of([]);
    })
  );

  public readonly plannings$: Observable<DailyDriverPlanningListPresentation[]> = combineLatest([
    this.drivers$,
    this.scheduledFares$
  ]).pipe(
    map(([drivers, fares]: [(Driver & Entity)[], (Entity & Scheduled)[]]): DailyDriverPlanning[] =>
      toDailyDriverPlanning(drivers, fares)
    ),
    map((plannings: DailyDriverPlanning[]): DailyDriverPlanningListPresentation[] =>
      toDailyDriverPlanningListPresentation(plannings)
    )
  );

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _date: DateService,
    @Inject(SCHEDULED_FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: ScheduledFaresForDateQuery,
    @Inject(LIST_DRIVERS_WITH_ORDER_QUERY) private readonly _listDriversWithOrderQuery: ListDriversWithOrderQuery
  ) {}

  public async onPlanningDateChange(planningDate: string): Promise<void> {
    await this._router.navigate(['planning', 'daily-list', planningDate]);
  }
}
