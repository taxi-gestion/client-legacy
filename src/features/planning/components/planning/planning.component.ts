import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const HOURS_IN_DAY: 24 = 24 as const;
const MINUTES_IN_HOUR: 60 = 60 as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-planning',
  templateUrl: './planning.component.html'
})
export class PlanningComponent implements OnChanges {
  @Input() public start: number = 0;

  @Input() public end: number = HOURS_IN_DAY * MINUTES_IN_HOUR;

  @Input() public interval: number = 60;

  public readonly columnWidth: number = 400;

  public _timeInMinutes$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  public timeInMinutes$: Observable<number[]> = this._timeInMinutes$.asObservable();

  /* eslint-disable no-mixed-operators */
  private hoursRange(): number[] {
    return Array.from(
      { length: (HOURS_IN_DAY * MINUTES_IN_HOUR - this.start - (HOURS_IN_DAY * MINUTES_IN_HOUR - this.end)) / this.interval },
      (_: string, i: number): number => i * this.interval + this.start
    );
  }
  /* eslint-enable */

  public ngOnChanges(): void {
    this._timeInMinutes$.next(this.hoursRange());
  }
}
