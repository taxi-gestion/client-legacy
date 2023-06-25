import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const HOURS_IN_DAY: 24 = 24 as const;
const MINUTES_IN_HOUR: 60 = 60 as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-planning',
  templateUrl: './planning.component.html'
})
export class PlanningComponent implements OnInit, OnChanges {
  @Input() public start: number = 0;
  @Input() public end: number = HOURS_IN_DAY * MINUTES_IN_HOUR;
  @Input() public pitch: number = 60;
  @Input() public hourColumnSize: number = 200;

  public _hours$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public hours$: Observable<number[]> = this._hours$.asObservable();

  /* eslint-disable no-mixed-operators */
  private hoursRange(): number[] {
    return Array.from(
      { length: (HOURS_IN_DAY * MINUTES_IN_HOUR - this.start - (HOURS_IN_DAY * MINUTES_IN_HOUR - this.end)) / this.pitch },
      (_: string, i: number): number => i + this.start / this.pitch
    );
  }
  /* eslint-enable */

  public ngOnInit(): void {
    this._hours$.next(this.hoursRange());
  }

  public ngOnChanges(): void {
    this._hours$.next(this.hoursRange());
  }
}
