import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { FareForDate, FARES_FOR_DATE_QUERY, FaresForDateQuery } from '@features/planning';
import { PlanningSettings } from '../../components/planning/planning-settings/planning-settings.component';
import { DEFAULT_END_TIME, DEFAULT_START_TIME } from '../../components/planning/planning-settings/planning-settings.form';
import {
  toStandardDateFormat,
  groupByPlanning,
  toFaresForDatePlanningSession,
  toFaresForDatePresentation
} from '../../common/fares.presenter';
import { DailyPlannings } from '../../common/fares.presentation';

const DEFAULT_PLANNING_SETTINGS: PlanningSettings = {
  interval: 30,
  start: +DEFAULT_START_TIME * 60,
  end: +DEFAULT_END_TIME * 60
};

const paramsToDate = (params: Params): Date => (params['date'] == null ? new Date() : new Date(params['date'] as string));

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily.page.html'
})
export class DailyPage {
  public planningDate: string = toStandardDateFormat(paramsToDate(this._route.snapshot.params));

  public planningSettings: PlanningSettings = DEFAULT_PLANNING_SETTINGS;

  public readonly plannings$: Observable<DailyPlannings> = this._route.params.pipe(
    switchMap((params: Params): Observable<FareForDate[]> => this._faresForDateQuery(paramsToDate(params))),
    map(toFaresForDatePresentation),
    map(toFaresForDatePlanningSession),
    map(groupByPlanning)
  );

  public showScheduleFareModal: boolean = false;

  public constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: FaresForDateQuery
  ) {}

  public handleScheduleFareModalClose(): void {
    this.showScheduleFareModal = false;
  }

  public openScheduleFareModal(): void {
    this.showScheduleFareModal = true;
  }

  public async onPlanningDateChange(planningDate: string): Promise<void> {
    await this._router.navigate(['/planning/daily', planningDate]);
  }
}
