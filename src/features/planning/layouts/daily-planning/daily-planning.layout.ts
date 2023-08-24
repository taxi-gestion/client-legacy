import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { combineLatest, map, Observable, Subject, switchMap, take } from 'rxjs';
import { PlanningSettings } from '../../components/planning/planning-settings/planning-settings.component';
import { DEFAULT_END_HOUR, DEFAULT_START_HOUR } from '../../components/planning/planning-settings/planning-settings.form';
import { toDailyDriverPlanning } from '../../common/fares.presenter';
import { toStandardDateFormat } from '../../common/unit-convertion';
import {
  PENDING_RETURNS_FOR_DATE_QUERY,
  PendingReturnsForDateQuery,
  SCHEDULED_FARES_FOR_DATE_QUERY,
  ScheduledFaresForDateQuery
} from '../../providers';
import { Driver, Entity, Pending, Scheduled } from '@domain';
import { PendingPresentation, toPendingReturnsForDatePresentation } from '../../common';
import { DailyDriverPlanning } from '../../common/fares.presentation';
import { LIST_DRIVERS_QUERY, ListDriversQuery } from '@features/common/driver';

const DEFAULT_PLANNING_SETTINGS: PlanningSettings = {
  interval: 30,
  start: +DEFAULT_START_HOUR * 60,
  end: +DEFAULT_END_HOUR * 60
};

const paramsToDateString = (params: Params): string =>
  params['date'] == null ? toStandardDateFormat(new Date()) : (params['date'] as string);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily-planning.layout.html'
})
export class DailyPlanningLayout {
  public planningDate: string = paramsToDateString(this._route.snapshot.params);

  public planningSettings: PlanningSettings = DEFAULT_PLANNING_SETTINGS;

  private readonly _drivers: Subject<(Driver & Entity)[]> = new Subject<(Driver & Entity)[]>();

  public readonly drivers$: Observable<(Driver & Entity)[]> = this._drivers.pipe(
    switchMap((): Observable<(Driver & Entity)[]> => this._listDriversQuery()),
    take(1)
  );

  public readonly fares$: Observable<(Entity & Scheduled)[]> = this._route.params.pipe(
    switchMap((params: Params): Observable<(Entity & Scheduled)[]> => this._faresForDateQuery(paramsToDateString(params)))
  );

  public readonly plannings$: Observable<DailyDriverPlanning[]> = combineLatest([this.drivers$, this.fares$]).pipe(
    map(([drivers, fares]: [(Driver & Entity)[], (Entity & Scheduled)[]]): DailyDriverPlanning[] =>
      toDailyDriverPlanning(drivers, fares)
    )
  );

  public readonly returnsToSchedule$: Observable<PendingPresentation[]> = this._route.params.pipe(
    switchMap(
      (params: Params): Observable<(Entity & Pending)[]> => this._pendingReturnsForDateQuery(paramsToDateString(params))
    ),
    map(toPendingReturnsForDatePresentation)
  );

  public constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(SCHEDULED_FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: ScheduledFaresForDateQuery,
    @Inject(PENDING_RETURNS_FOR_DATE_QUERY) private readonly _pendingReturnsForDateQuery: PendingReturnsForDateQuery,
    @Inject(LIST_DRIVERS_QUERY) private readonly _listDriversQuery: ListDriversQuery //@Inject(DELETE_FARE_ACTION) private readonly _deleteFare: DeleteFareAction,
  ) {}

  public async onPlanningDateChange(planningDate: string): Promise<void> {
    await this._router.navigate(['planning', 'daily', planningDate]);
  }

  public onPlanningSlotClick: (timeInMinutes: number, context: unknown) => Promise<void> = openScheduleFarePage$(
    this._router,
    this.planningDate
  );

  public onPlanningSessionClick: (session: unknown, context: unknown) => Promise<void> = openScheduleReturnPage$(this._router);

  /*deleteFareAction$(
    this._router,
    this._deleteFare
  );*/
}

const openScheduleFarePage$ =
  (router: Router, date: string) =>
  async (timeInMinutes: number, context: unknown): Promise<void> => {
    await router.navigate([
      'planning',
      'daily',
      'schedule-fare',
      { date, timeInMinutes, driver: (context as DailyDriverPlanning).driver.identifier }
    ]);
  };

const openScheduleReturnPage$ = (router: Router) => async (): Promise<void> => {
  await router.navigate(['planning', 'daily', 'schedule-return']);
};

//const deleteFareAction$ =
//  (router: Router, deleteAction: DeleteFareAction) =>
//    async (fareFromPlanningSession: unknown): Promise<void> => {
//      deleteAction((fareFromPlanningSession as ScheduledPlanningSession).id);
//      await router.navigate([
//        'planning',
//        'daily'
//      ]);
//};
