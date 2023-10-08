import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { catchError, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Entity, Scheduled } from '@definitions';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { SCHEDULED_FARES_FOR_DATE_QUERY, ScheduledFaresForDateQuery } from '@features/fare';
import { BillingItem, BillingItemsByDriver } from '../../definitions/billing.presentation';
import { routeParamToDateString } from '@features/common/angular';
import {
  FaresByNature,
  groupByDriver,
  groupByNature,
  sortBillingItemsByDriverByTime,
  toBillingItem
} from '../../common/billing.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './standard-billing.page.html'
})
export class StandardBillingPage {
  public billingDay$: Observable<string> = this._route.params.pipe(
    map((params: Params): string => routeParamToDateString('date', params, new Date()))
  );

  public readonly refresh$: Observable<NavigationEnd> = this._router.events.pipe(
    filter((routerEvent: unknown): routerEvent is NavigationEnd => routerEvent instanceof NavigationEnd)
  );

  public readonly billingItemsByNature$: Observable<FaresByNature> = this.refresh$.pipe(
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
    }),
    map(groupByNature)
  );

  public readonly standardBilling$: Observable<BillingItemsByDriver> = this.billingItemsByNature$.pipe(
    map((fares: FaresByNature): BillingItem[] => fares.standard.map(toBillingItem)),
    map(groupByDriver),
    map(sortBillingItemsByDriverByTime)
  );

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(SCHEDULED_FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: ScheduledFaresForDateQuery
  ) {}

  public async onBillingDateChange(planningDate: string): Promise<void> {
    await this._router.navigate(['billing', 'standard', planningDate]);
  }
}
