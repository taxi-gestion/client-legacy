import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { SCHEDULED_FARES_FOR_DATE_QUERY, ScheduledFaresForDateQuery } from '@features/planning';
import { Session, SESSION_PERSISTENCE } from '../../../authentication';
import { filterByPlanning, toScheduledFaresPresentation } from '../../common/fares.presenter';
import { toStandardDateFormat } from '../../common/unit-convertion';
import { Entity, Scheduled } from '@definitions';
import { ScheduledPresentation } from '../../common/fares.presentation';
import { sortByDatetime, toAgendaFares } from './driver-agenda.presenter';

const paramsToDateString = (params: Params): string =>
  params['date'] == null ? toStandardDateFormat(new Date()) : (params['date'] as string);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './driver-agenda.page.html'
})
export class DriverAgendaPage {
  public planningDate: string = paramsToDateString(this._route.snapshot.params);

  public readonly agenda$: Observable<ScheduledPresentation[]> = this._route.params.pipe(
    switchMap((params: Params): Observable<(Entity & Scheduled)[]> => this._faresForDateQuery(paramsToDateString(params))),
    map(toScheduledFaresPresentation),
    map(filterByPlanning(this._session.username())),
    map(toAgendaFares),
    map(sortByDatetime)
  );

  public constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(SCHEDULED_FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: ScheduledFaresForDateQuery,
    @Inject(SESSION_PERSISTENCE) private readonly _session: Session
  ) {}

  public async onPlanningDateChange(planningDate: string): Promise<void> {
    await this._router.navigate(['planning', 'agenda', planningDate]);
  }
}
