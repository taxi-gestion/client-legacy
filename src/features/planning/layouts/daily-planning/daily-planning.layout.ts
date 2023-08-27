import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, filter, map, Observable, of, startWith, Subject, switchMap, take, tap } from 'rxjs';
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
export class DailyPlanningLayout implements OnInit {
  private readonly _refresh$: Subject<void> = new Subject<void>();
  public readonly refresh$: Observable<void> = this._refresh$.asObservable();

  public planningDay: string = paramsToDateDayString(this._route.snapshot.params);

  public planningSettings: PlanningSettings = DEFAULT_PLANNING_SETTINGS;

  private readonly _selectedSlotContext$: BehaviorSubject<SlotContext<DailyDriverPlanning> | null> =
    new BehaviorSubject<SlotContext<DailyDriverPlanning> | null>(null);

  public readonly selectedSlotContext$: Observable<SlotContext<DailyDriverPlanning> | null> =
    this._selectedSlotContext$.asObservable();

  private readonly _selectedSessionContext$: BehaviorSubject<SessionContext<
    ScheduledPlanningSession,
    DailyDriverPlanning
  > | null> = new BehaviorSubject<SessionContext<ScheduledPlanningSession, DailyDriverPlanning> | null>(null);

  public readonly selectedSessionContext$: Observable<SessionContext<ScheduledPlanningSession, DailyDriverPlanning> | null> =
    this._selectedSessionContext$.asObservable();

  public readonly drivers$: Observable<(Driver & Entity)[]> = of([]).pipe(
    switchMap((): Observable<(Driver & Entity)[]> => this._listDriversQuery()),
    take(1)
  );

  public ngOnInit(): void {
    this.refreshDataOnNavigatedTo();
  }

  public refreshDataOnNavigatedTo(): void {
    this._router.events.pipe(
      filter((routerEvent: unknown): routerEvent is NavigationEnd => routerEvent instanceof NavigationEnd),
      tap((): void => this._refresh$.next())
    );
  }

  public readonly scheduledFares$: Observable<(Entity & Scheduled)[]> = this.refresh$.pipe(
    startWith(null),
    switchMap((): Observable<Params> => this._route.params),
    switchMap((params: Params): Observable<(Entity & Scheduled)[]> => this._faresForDateQuery(paramsToDateDayString(params)))
  );

  public readonly returnsToSchedule$: Observable<(Entity & Pending)[]> = this.refresh$.pipe(
    startWith(null),
    switchMap((): Observable<Params> => this._route.params),
    switchMap(
      (params: Params): Observable<(Entity & Pending)[]> => this._pendingReturnsForDateQuery(paramsToDateDayString(params))
    )
  );

  public readonly plannings$: Observable<DailyDriverPlanning[]> = combineLatest([this.drivers$, this.scheduledFares$]).pipe(
    map(([drivers, fares]: [(Driver & Entity)[], (Entity & Scheduled)[]]): DailyDriverPlanning[] =>
      toDailyDriverPlanning(drivers, fares)
    )
  );

  public constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(SCHEDULED_FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: ScheduledFaresForDateQuery,
    @Inject(PENDING_RETURNS_FOR_DATE_QUERY) private readonly _pendingReturnsForDateQuery: PendingReturnsForDateQuery,
    @Inject(LIST_DRIVERS_QUERY) private readonly _listDriversQuery: ListDriversQuery
  ) {}

  public async onPlanningDateChange(planningDate: string): Promise<void> {
    await this._router.navigate(['planning', 'daily', planningDate]);
  }

  public onPlanningSlotClick(slotContext: SlotContext<DailyDriverPlanning>): void {
    this._selectedSlotContext$.next(slotContext);
  }

  public onPlanningSessionClick(sessionContext: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>): void {
    this._selectedSessionContext$.next(sessionContext);
  }
}
