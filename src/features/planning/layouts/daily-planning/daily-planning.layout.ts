import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { PlanningSettings } from '../../components/planning/planning-settings/planning-settings.component';
import { DEFAULT_END_HOUR, DEFAULT_START_HOUR } from '../../components/planning/planning-settings/planning-settings.form';
import {
  groupByDriverPlanning,
  toFaresForDatePlanningSession,
  toScheduledFaresPresentation
} from '../../common/fares.presenter';
import { toStandardDateFormat } from '../../common/unit-convertion';
import {
  SCHEDULED_FARES_FOR_DATE_QUERY,
  ScheduledFaresForDateQuery,
  PENDING_RETURNS_FOR_DATE_QUERY,
  PendingReturnsForDateQuery
} from '../../providers';
import { Entity, Pending, Scheduled } from '@domain';
import { PendingPresentation, toPendingReturnsForDatePresentation } from '../../common';
import { DailyDriverPlanning } from '../../common/fares.presentation';

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

  public readonly plannings$: Observable<DailyDriverPlanning[]> = this._route.params.pipe(
    switchMap((params: Params): Observable<Scheduled[]> => this._faresForDateQuery(paramsToDateString(params))),
    map(toScheduledFaresPresentation),
    map(toFaresForDatePlanningSession),
    map(groupByDriverPlanning)
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
    @Inject(PENDING_RETURNS_FOR_DATE_QUERY) private readonly _pendingReturnsForDateQuery: PendingReturnsForDateQuery
  ) {}

  public async onPlanningDateChange(planningDate: string): Promise<void> {
    await this._router.navigate(['planning', 'daily', planningDate]);
  }

  public onPlanningSlotClick: (timeInMinutes: number, context: unknown) => Promise<void> = onPlanningSlotClick$(
    this._router,
    this.planningDate
  );
}

const onPlanningSlotClick$ =
  (router: Router, date: string) =>
  async (timeInMinutes: number, context: unknown): Promise<void> => {
    await router.navigate([
      'planning',
      'daily',
      'schedule-fare',
      { date, timeInMinutes, driver: (context as DailyDriverPlanning).driver }
    ]);
  };
