import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { catchError, combineLatest, filter, map, Observable, of, startWith, switchMap, take } from 'rxjs';
import { toDailyDriverPlanning } from '../../common/fares.presenter';
import { Driver, DriverWithOrder, Entity, Scheduled } from '@definitions';
import { LIST_DRIVERS_WITH_ORDER_QUERY, ListDriversWithOrderQuery, sortDriversByDisplayOrder } from '@features/common/driver';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { DailyDriverPlanningListPresentation, toDailyDriverPlanningListPresentation } from './daily-planning-list.presenter';
import { SCHEDULED_FARES_FOR_DATE_QUERY, ScheduledFaresForDateQuery } from '@features/fare';
import { routeParamToDateString } from '@features/common/angular';
import { DailyDriverPlanning } from '../../common/agenda.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily-planning-list.layout.html'
})
export class DailyPlanningListLayout {
  public planningDay$: Observable<string> = this._route.params.pipe(
    map((params: Params): string => routeParamToDateString('date', params, new Date()))
  );

  public readonly drivers$: Observable<(Driver & Entity)[]> = of([]).pipe(
    switchMap((): Observable<DriverWithOrder[]> => this._listDriversWithOrderQuery()),
    map(sortDriversByDisplayOrder),
    take(1)
  );

  public readonly refresh$: Observable<NavigationEnd> = this._router.events.pipe(
    filter((routerEvent: unknown): routerEvent is NavigationEnd => routerEvent instanceof NavigationEnd)
  );

  public readonly scheduledFares$: Observable<(Entity & Scheduled)[]> = this.refresh$.pipe(
    startWith(null),
    switchMap((): Observable<Params> => this._route.params),
    switchMap(
      (params: Params): Observable<(Entity & Scheduled)[]> =>
        this._faresForDateQuery(routeParamToDateString('date', params, new Date()))
    ),
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
    private readonly _route: ActivatedRoute,
    @Inject(SCHEDULED_FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: ScheduledFaresForDateQuery,
    @Inject(LIST_DRIVERS_WITH_ORDER_QUERY) private readonly _listDriversWithOrderQuery: ListDriversWithOrderQuery
  ) {}

  public async onPlanningDateChange(planningDate: string): Promise<void> {
    await this._router.navigate(['planning', 'daily-list', planningDate]);
  }
}
