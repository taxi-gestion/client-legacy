import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';
import { Session, SESSION_PERSISTENCE } from '../../../authentication';
import { Entity, Scheduled } from '@definitions';
import { toStandardDateFormat } from '@features/common/angular';

import { DRIVER_FARES_FOR_DATE_QUERY, DriverFaresForDateQuery } from '../../providers';
import { sortByDatetime } from '../../../common/presentation/sort.presenter';
import { DriverScheduledFarePresentation, toDriverScheduledFaresPresentation } from './driver-agenda.presenter';

const paramsToDateString = (params: Params): string =>
  params['date'] == null ? toStandardDateFormat(new Date()) : (params['date'] as string);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './driver-agenda.page.html'
})
export class DriverAgendaPage {
  private readonly _hideFinishedFares$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public toggleFinishedFares(toggle: Event): void {
    this._hideFinishedFares$.next((toggle.target as HTMLInputElement).checked);
  }

  public readonly agenda$: Observable<DriverScheduledFarePresentation[]> = combineLatest([
    this._route.params,
    this._hideFinishedFares$
  ]).pipe(
    switchMap(
      // eslint-disable-next-line @typescript-eslint/typedef
      ([params, hideFinished]): Observable<(Entity & Scheduled)[]> =>
        this._driverFaresForDateQuery({ driver: { id: this._session.userId() }, date: paramsToDateString(params) }).pipe(
          map((items: (Entity & Scheduled)[]): (Entity & Scheduled)[] => sortByDatetime<Entity & Scheduled>(items)),
          //map((items) => (hideFinished ? items.filter((item) => item.state === 'finished') : items))
          map((items: (Entity & Scheduled)[]): (Entity & Scheduled)[] => (hideFinished ? [] : items))
        )
    ),
    map(toDriverScheduledFaresPresentation)
  );

  public constructor(
    private readonly _route: ActivatedRoute,
    @Inject(DRIVER_FARES_FOR_DATE_QUERY) private readonly _driverFaresForDateQuery: DriverFaresForDateQuery,
    @Inject(SESSION_PERSISTENCE) private readonly _session: Session
  ) {}
}
