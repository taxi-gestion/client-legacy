import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Entity, Regular } from '@definitions';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { toLongDateFormat } from '@features/common/angular';
import { DateService } from '../../../common/date/services';
import { generateExcelFromData } from './exports.presenter';
import { ALL_REGULARS_QUERY, AllRegularsQuery } from '../../providers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './exports.page.html'
})
export class ExportsPage {
  public selectedDate$: Observable<Date> = this._date.date$();

  public userFriendlyDate$: Observable<string> = this.selectedDate$.pipe(map(toLongDateFormat));

  public readonly regulars$: Observable<(Entity & Regular)[]> = this._allRegularsQuery().pipe(
    catchError((error: Error): Observable<(Entity & Regular)[]> => {
      this._toaster.toast({
        content: `Échec de la récupération des passagers : ${error.name} | ${error.message}`,
        status: 'danger',
        title: 'Opération échouée'
      });
      return of([]);
    })
  );

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _date: DateService,
    @Inject(ALL_REGULARS_QUERY) private readonly _allRegularsQuery: AllRegularsQuery
  ) {}

  public downloadAsExcel(data: (Entity & Regular)[]): void {
    generateExcelFromData(data);
  }
}
