import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { DRIVER_AGENDA_FOR_DATE_QUERY, DriverAgendaForDateQuery } from '@features/planning';
import { Session, SESSION_PERSISTENCE } from '../../../authentication';
import { toScheduledFaresPresentation } from '../../common/fares.presenter';
import { Entity, Scheduled } from '@definitions';
import { FareDriverCardPresentation, sortByDatetime, toAgendaFares } from '../../common/agenda.presenter';
import { toStandardDateFormat } from '@features/common/angular';

const paramsToDateString = (params: Params): string =>
  params['date'] == null ? toStandardDateFormat(new Date()) : (params['date'] as string);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './driver-agenda.page.html'
})
export class DriverAgendaPage {
  public planningDate: string = paramsToDateString(this._route.snapshot.params);

  public readonly agenda$: Observable<FareDriverCardPresentation[]> = this._route.params.pipe(
    switchMap(
      (params: Params): Observable<(Entity & Scheduled)[]> =>
        this._driverAgendaForDateQuery({ driver: { id: this._session.userId() }, date: paramsToDateString(params) })
    ),
    map(toScheduledFaresPresentation),
    map(toAgendaFares),
    map(sortByDatetime)
  );

  public constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(DRIVER_AGENDA_FOR_DATE_QUERY) private readonly _driverAgendaForDateQuery: DriverAgendaForDateQuery,
    @Inject(SESSION_PERSISTENCE) private readonly _session: Session
  ) {}

  public async onPlanningDateChange(planningDate: string): Promise<void> {
    await this._router.navigate(['planning', 'agenda', planningDate]);
  }
}
