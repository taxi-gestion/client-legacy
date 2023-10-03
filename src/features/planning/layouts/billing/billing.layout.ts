import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { catchError, combineLatest, filter, map, Observable, of, startWith, switchMap, take } from 'rxjs';
import { toDailyDriverPlanning } from '../../common/fares.presenter';
import { SCHEDULED_FARES_FOR_DATE_QUERY, ScheduledFaresForDateQuery } from '../../providers';
import { Driver, Entity, Scheduled } from '@definitions';
import { DailyDriverPlanning } from '../../common/fares.presentation';
import { LIST_DRIVERS_QUERY, ListDriversQuery } from '@features/common/driver';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { paramsToDateDayString } from '../../common/date.presenter';
import { BillingByDriverPresentation, toBillingByDriverPresentation } from './billing.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './billing.layout.html'
})
export class BillingLayout {
  public billingDay$: Observable<string> = this._route.params.pipe(
    map((params: Params): string => paramsToDateDayString(params))
  );

  public readonly drivers$: Observable<(Driver & Entity)[]> = of([]).pipe(
    switchMap((): Observable<(Driver & Entity)[]> => this._listDriversQuery()),
    take(1)
  );

  public readonly refresh$: Observable<NavigationEnd> = this._router.events.pipe(
    filter((routerEvent: unknown): routerEvent is NavigationEnd => routerEvent instanceof NavigationEnd)
  );

  public readonly scheduledFares$: Observable<(Entity & Scheduled)[]> = this.refresh$.pipe(
    startWith(null),
    switchMap((): Observable<Params> => this._route.params),
    switchMap((params: Params): Observable<(Entity & Scheduled)[]> => this._faresForDateQuery(paramsToDateDayString(params))),
    catchError((error: Error): Observable<(Entity & Scheduled)[]> => {
      this._toaster.toast({
        content: `Échec de la récupération des courses : ${error.name} | ${error.message}`,
        status: 'danger',
        title: 'Opération échouée'
      });
      return of([]);
    })
  );

  public readonly plannings$: Observable<BillingByDriverPresentation[]> = combineLatest([
    this.drivers$,
    this.scheduledFares$
  ]).pipe(
    map(([drivers, fares]: [(Driver & Entity)[], (Entity & Scheduled)[]]): DailyDriverPlanning[] =>
      toDailyDriverPlanning(drivers, fares)
    ),
    map((plannings: DailyDriverPlanning[]): BillingByDriverPresentation[] => toBillingByDriverPresentation(plannings))
  );

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(SCHEDULED_FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: ScheduledFaresForDateQuery,
    @Inject(LIST_DRIVERS_QUERY) private readonly _listDriversQuery: ListDriversQuery
  ) {}

  public async onBillingDateChange(planningDate: string): Promise<void> {
    await this._router.navigate(['planning', 'billing', planningDate]);
  }
}
