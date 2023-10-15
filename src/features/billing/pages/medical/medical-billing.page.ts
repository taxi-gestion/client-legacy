import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Entity, Scheduled } from '@definitions';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { SCHEDULED_FARES_FOR_DATE_QUERY, ScheduledFaresForDateQuery } from '@features/fare';
import { BillingItem, BillingItemsByDriver } from '../../definitions/billing.presentation';
import { toLongDateFormat, toStandardDateFormat } from '@features/common/angular';
import { FaresByNature, groupByDriver, groupByNature, sortByDatetime, toBillingItem } from '../../common/billing.presenter';
import { DateService } from '../../../common/date/services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './medical-billing.page.html'
})
export class MedicalBillingPage {
  public selectedDate$: Observable<Date> = this._date.date$();

  public userFriendlyDate$: Observable<string> = this.selectedDate$.pipe(map(toLongDateFormat));

  public readonly billingItemsByNature$: Observable<FaresByNature> = this.selectedDate$.pipe(
    switchMap((date: Date): Observable<(Entity & Scheduled)[]> => this._faresForDateQuery(toStandardDateFormat(date))),
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

  public readonly medicalBilling$: Observable<BillingItemsByDriver> = this.billingItemsByNature$.pipe(
    map((fares: FaresByNature): BillingItem[] => fares.medical.map(toBillingItem)),
    map(sortByDatetime<BillingItem>),
    map(groupByDriver)
  );

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _date: DateService,
    @Inject(SCHEDULED_FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: ScheduledFaresForDateQuery
  ) {}
}
