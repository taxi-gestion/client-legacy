import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FARES_BY_DAY_QUERY, FaresForDate, FaresForDateQuery } from '../../providers';
import { formatDate } from './daily.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily.page.html'
})
export class DailyPage {
  private readonly _today: Date = new Date();

  public today: string = formatDate(this._today);

  public constructor(@Inject(FARES_BY_DAY_QUERY) private readonly _faresForDateQuery$: FaresForDateQuery) {}

  public readonly faresForDate$: Observable<FaresForDate> = this._faresForDateQuery$(this._today);
}
