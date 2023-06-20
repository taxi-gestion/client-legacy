import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FARES_FOR_DATE_QUERY, FaresForDateQuery, FareToSchedule } from '@features/planning';
import { ActivatedRoute } from '@angular/router';
import {
  formatDateDDMMYYYY,
  groupByPlanning,
  toFaresForDatePlanningSession,
  toFaresForDatePresentation
} from '../../common/fares.presenter';
import { DailyPlannings } from '../../common/fares.presentation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily.page.html',
  styleUrls: ['./daily.page.css']
})
export class DailyPage {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly _dateFromUrl: string | null = this._route.snapshot.params['date'];
  private readonly _selectedDate: Date = this._dateFromUrl == null ? new Date() : new Date(this._dateFromUrl);
  public ddMMYYYYtoday: string = formatDateDDMMYYYY(this._selectedDate);

  public constructor(
    private readonly _route: ActivatedRoute,
    @Inject(FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: FaresForDateQuery
  ) {}

  public readonly plannings$: Observable<DailyPlannings> = this._faresForDateQuery(this._selectedDate).pipe(
    map(toFaresForDatePresentation),
    map(toFaresForDatePlanningSession),
    map(groupByPlanning)
  );

  public showScheduleFareModal: boolean = false;

  public scheduleFareFormInitialValues: Partial<FareToSchedule> = {
    date: this._selectedDate,
    driveKind: 'outward',
    driveNature: 'medical'
  };
  public handleScheduleFareModalClose(): void {
    this.showScheduleFareModal = false;
  }
  public openScheduleFareModal(): void {
    this.showScheduleFareModal = true;
  }
}
