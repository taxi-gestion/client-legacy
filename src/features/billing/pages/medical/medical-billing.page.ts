import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { Entity, Scheduled } from '@definitions';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import {
  SCHEDULED_FARES_FOR_DATE_QUERY,
  SCHEDULED_FARES_FOR_PERIOD_QUERY,
  ScheduledFaresForDateQuery,
  ScheduledFaresForPeriodQuery
} from '@features/fare';
import { BillingItem, BillingItemsByDriver } from '../../definitions/billing.presentation';
import { toLongDateFormat, toStandardDateFormat } from '@features/common/angular';
import { DateService } from '../../../common/date/services';
import {
  FaresByNature,
  generateExcelFromDataByDriver,
  generateExcelFromDataByPassenger,
  groupByDriver,
  groupByNature,
  groupByPassenger,
  toBillingItem
} from '../billing.presenter';
import { sortByDatetime } from '../../../common/presentation/sort.presenter';
import { format } from 'date-fns-tz';

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

  public readonly items$: Observable<BillingItem[]> = this.billingItemsByNature$.pipe(
    map((fares: FaresByNature): BillingItem[] => fares.medical.map(toBillingItem)),
    map((items: BillingItem[]): BillingItem[] => sortByDatetime<BillingItem>(items))
  );

  public readonly medicalBilling$: Observable<BillingItemsByDriver> = this.items$.pipe(map(groupByDriver));

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _date: DateService,
    @Inject(SCHEDULED_FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: ScheduledFaresForDateQuery,
    @Inject(SCHEDULED_FARES_FOR_PERIOD_QUERY) private readonly _faresForPeriodQuery$: ScheduledFaresForPeriodQuery
  ) {}

  public downloadAsExcelByDriver(data: BillingItem[]): void {
    generateExcelFromDataByDriver(groupByDriver(data));
  }

  public downloadAsExcelByPassenger(data: BillingItem[]): void {
    generateExcelFromDataByPassenger(groupByPassenger(data));
  }

  public downloadPeriodAsExcelByPassenger(from: Date, to: Date): void {
    this._faresForPeriodQuery$({ from: toStandardDateFormat(from), to: toStandardDateFormat(to) })
      .pipe(
        map(groupByNature),
        map((fares: FaresByNature): BillingItem[] => fares.medical.map(toBillingItem)),
        map((items: BillingItem[]): BillingItem[] => sortByDatetime<BillingItem>(items)),
        tap((data: BillingItem[]): void =>
          generateExcelFromDataByPassenger(
            groupByPassenger(data),
            `export_medical_${format(from, 'yyyyMMdd')}_${format(to, 'yyyyMMdd')}.xlsx`
          )
        )
      )
      .subscribe();
  }

  public downloadPeriodAsExcelByPassengerAction = (from: Date, to: Date): void => {
    this.downloadPeriodAsExcelByPassenger(from, to);
  };
}
