import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { PlanningSettings } from '../../components/planning/planning-settings/planning-settings.component';
import { DEFAULT_END_HOUR, DEFAULT_START_HOUR } from '../../components/planning/planning-settings/planning-settings.form';
import { groupByPlanning, toFaresForDatePlanningSession, toFaresForDatePresentation } from '../../common/fares.presenter';
import { DailyPlannings } from '../../common/fares.presentation';
import { toStandardDateFormat } from '../../common/unit-convertion';
import { ReturnToAffectForDatePresentation } from '../../common/returns-to-affect.presentation';
import { toReturnsToAffectForDatePresentation } from '../../common/returns-to-affect.presenter';
import {
  FareForDate,
  FARES_FOR_DATE_QUERY,
  FaresForDateQuery,
  RETURNS_TO_AFFECT_FOR_DATE_QUERY,
  ReturnsToAffectForDateQuery,
  ReturnToAffectForDate
} from '../../providers';

const DEFAULT_PLANNING_SETTINGS: PlanningSettings = {
  interval: 30,
  start: +DEFAULT_START_HOUR * 60,
  end: +DEFAULT_END_HOUR * 60
};

const paramsToDateString = (params: Params): string =>
  params['date'] == null ? toStandardDateFormat(new Date()) : (params['date'] as string);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily.layout.html'
})
export class DailyLayout {
  public planningDate: string = paramsToDateString(this._route.snapshot.params);

  public planningSettings: PlanningSettings = DEFAULT_PLANNING_SETTINGS;

  public readonly plannings$: Observable<DailyPlannings> = this._route.params.pipe(
    switchMap((params: Params): Observable<FareForDate[]> => this._faresForDateQuery(paramsToDateString(params))),
    map(toFaresForDatePresentation),
    map(toFaresForDatePlanningSession),
    map(groupByPlanning)
  );

  public readonly returnsToSchedule$: Observable<ReturnToAffectForDatePresentation[]> = this._route.params.pipe(
    switchMap(
      (params: Params): Observable<ReturnToAffectForDate[]> => this._returnsToAffectForDateQuery(paramsToDateString(params))
    ),
    map(toReturnsToAffectForDatePresentation)
  );

  public constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: FaresForDateQuery,
    @Inject(RETURNS_TO_AFFECT_FOR_DATE_QUERY) private readonly _returnsToAffectForDateQuery: ReturnsToAffectForDateQuery
  ) {}

  public async onPlanningDateChange(planningDate: string): Promise<void> {
    await this._router.navigate(['planning', 'daily', planningDate]);
  }
}
