import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FareByDay, FARES_BY_DAY_QUERY, FaresByDayQuery } from '../../providers';
import { formatDate } from './daily.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily.page.html'
})
export class DailyPage {
  private readonly _today: Date = new Date();

  public today: string = formatDate(this._today);

  public constructor(@Inject(FARES_BY_DAY_QUERY) private readonly _faresByDayQuery$: FaresByDayQuery) {}

  public readonly faresByDay$: Observable<FareByDay[]> = this._faresByDayQuery$(this._today);
}
