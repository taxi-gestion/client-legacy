import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { FareForDate, FARES_FOR_DATE_QUERY, FaresForDateQuery } from '@features/planning';
import { SESSION_PERSISTENCE, Session } from '../../../authentication';
import { filterByPlanning, toFaresForDatePresentation } from '../../common/fares.presenter';
import { FareForDatePresentation } from '../../common/fares.presentation';
import { toStandardDateFormat } from '@features/planning/common/unit-convertion';

const paramsToDate = (params: Params): Date => (params['date'] == null ? new Date() : new Date(params['date'] as string));

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './driver-agenda.page.html'
})
export class DriverAgendaPage {
  public planningDate: string = toStandardDateFormat(paramsToDate(this._route.snapshot.params));

  public readonly agenda$: Observable<FareForDatePresentation[]> = this._route.params.pipe(
    switchMap((params: Params): Observable<FareForDate[]> => this._faresForDateQuery(paramsToDate(params))),
    map(toFaresForDatePresentation),
    map(filterByPlanning(this._session.username()))
  );

  public constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: FaresForDateQuery,
    @Inject(SESSION_PERSISTENCE) private readonly _session: Session
  ) {}

  public async onPlanningDateChange(planningDate: string): Promise<void> {
    await this._router.navigate(['planning', 'agenda', planningDate]);
  }
}
