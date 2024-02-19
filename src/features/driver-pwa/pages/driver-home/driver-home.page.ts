import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DateService } from '../../../common/date';
import { map, Observable } from 'rxjs';
import { toLongDateFormat } from '../../../common/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './driver-home.page.html'
})
export class DriverHomePage {
  public selectedDate$: Observable<Date> = this._date.date$();
  public userFriendlyDate$: Observable<string> = this.selectedDate$.pipe(map(toLongDateFormat));
  public constructor(private readonly _date: DateService) {}
}
