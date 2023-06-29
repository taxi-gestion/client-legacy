import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FARES_FOR_DATE_QUERY, FaresForDateQuery } from '@features/planning';
import { ActivatedRoute } from '@angular/router';
import { filterByPlanning, formatDateDDMMYYYY, toFaresForDatePresentation } from '../../common/fares.presenter';
import { DailyAgenda } from '../../common/fares.presentation';
import { SESSION_PERSISTENCE, TokenSession } from '../../../authentication';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './driver-agenda.page.html'
})
export class DriverAgendaPage {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly _dateFromUrl: string | null = this._route.snapshot.params['date'];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly _selectedDate: Date = this._dateFromUrl == null ? new Date() : new Date(this._dateFromUrl);
  public today: string = formatDateDDMMYYYY(this._selectedDate);

  public constructor(
    private readonly _route: ActivatedRoute,
    @Inject(FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: FaresForDateQuery,
    @Inject(SESSION_PERSISTENCE) private readonly _tokenSession: TokenSession
  ) {}

  public readonly agenda$: Observable<DailyAgenda> = this._faresForDateQuery(this._selectedDate).pipe(
    map(toFaresForDatePresentation),
    map(filterByPlanning(this._tokenSession.idTokenPayload('custom:planning_identifier') as string))
  );
}
