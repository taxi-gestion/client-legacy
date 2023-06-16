import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FareForDate, FARES_FOR_DATE_QUERY, FaresForDate, FaresForDateQuery } from '@features/planning';
import { formatDate } from './daily-driver.presenter';
import { ActivatedRoute } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily-driver.page.html'
})
export class DailyDriverPage {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly _dateFromUrl: string | null = this._route.snapshot.params['date'];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly _planningFromUrl: string = this._route.snapshot.params['planning'] ?? '';
  private readonly _selectedDate: Date = this._dateFromUrl == null ? new Date() : new Date(this._dateFromUrl);
  public ddMMYYYYtoday: string = formatDate(this._selectedDate);

  public constructor(
    private readonly _route: ActivatedRoute,
    @Inject(FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: FaresForDateQuery
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  public readonly faresForDate$: Observable<FaresForDate> = this._faresForDateQuery(this._selectedDate);

  public readonly faresForOnePlanning$: Observable<FaresForDate> = this.faresForDate$.pipe(
    map(keepOnlyOnePlanning(this._planningFromUrl))
  );
}
const keepOnlyOnePlanning =
  (planningToKeep: string) =>
  (faresList: FareForDate[]): FaresForDate =>
    faresList.filter((fare: FareForDate): boolean => fare.planning === planningToKeep);
