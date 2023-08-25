import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap, take } from 'rxjs';
import { PlanningSettings } from '../../components/planning/planning-settings/planning-settings.component';
import { DEFAULT_END_HOUR, DEFAULT_START_HOUR } from '../../components/planning/planning-settings/planning-settings.form';
import { toDailyDriverPlanning } from '../../common/fares.presenter';
import {
  PENDING_RETURNS_FOR_DATE_QUERY,
  PendingReturnsForDateQuery,
  SCHEDULED_FARES_FOR_DATE_QUERY,
  ScheduledFaresForDateQuery
} from '../../providers';
import { Driver, Entity, Pending, Scheduled } from '@domain';
import { PendingPresentation, toPendingReturnsForDatePresentation } from '../../common';
import { DailyDriverPlanning, ScheduledPlanningSession } from '../../common/fares.presentation';
import { LIST_DRIVERS_QUERY, ListDriversQuery } from '@features/common/driver';
import { paramsToDateDayString } from './daily-planning.presenter';
import { SessionContext, SlotContext } from '../../components/planning/planning-row/planning-row.component';

const DEFAULT_PLANNING_SETTINGS: PlanningSettings = {
  interval: 30,
  start: +DEFAULT_START_HOUR * 60,
  end: +DEFAULT_END_HOUR * 60
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily-planning.layout.html'
})
export class DailyPlanningLayout {
  public planningDay: string = paramsToDateDayString(this._route.snapshot.params);

  public planningSettings: PlanningSettings = DEFAULT_PLANNING_SETTINGS;

  public readonly selectedSlotContext$: BehaviorSubject<SlotContext<DailyDriverPlanning> | null> =
    new BehaviorSubject<SlotContext<DailyDriverPlanning> | null>(null);

  public readonly selectedSessionContext$: BehaviorSubject<SessionContext<
    ScheduledPlanningSession,
    DailyDriverPlanning
  > | null> = new BehaviorSubject<SessionContext<ScheduledPlanningSession, DailyDriverPlanning> | null>(null);

  public readonly drivers$: Observable<(Driver & Entity)[]> = of([]).pipe(
    switchMap((): Observable<(Driver & Entity)[]> => this._listDriversQuery()),
    take(1)
  );

  public readonly fares$: Observable<(Entity & Scheduled)[]> = this._route.params.pipe(
    switchMap((params: Params): Observable<(Entity & Scheduled)[]> => this._faresForDateQuery(paramsToDateDayString(params)))
  );

  public readonly plannings$: Observable<DailyDriverPlanning[]> = combineLatest([this.drivers$, this.fares$]).pipe(
    map(([drivers, fares]: [(Driver & Entity)[], (Entity & Scheduled)[]]): DailyDriverPlanning[] =>
      toDailyDriverPlanning(drivers, fares)
    )
  );

  public readonly returnsToSchedule$: Observable<PendingPresentation[]> = this._route.params.pipe(
    switchMap(
      (params: Params): Observable<(Entity & Pending)[]> => this._pendingReturnsForDateQuery(paramsToDateDayString(params))
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

  //public onPlanningSlotClick: (context: unknown) => Promise<void> = openScheduleFarePage$(
  //  this._router,
  //  this.planningDay
  //);

  public async onPlanningSlotClick(slotContext: SlotContext<DailyDriverPlanning>): Promise<void> {
    await this._router.navigate(['planning', 'daily', 'schedule-fare']);
    this.selectedSlotContext$.next(slotContext);
  }

  public async onPlanningSessionClick(
    sessionContext: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>
  ): Promise<void> {
    await this._router.navigate(['planning', 'daily', 'schedule-return']);
    this.selectedSlotContext$.next(sessionContext);
  }

  /*deleteFareAction$(
    this._router,
    this._deleteFare
  );*/
}
