import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DurationDistance, isValidPlace, JourneyEstimate } from '@definitions';
import { combineLatest, debounceTime, map, Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { toDisplayDurationDistance, toJourney } from './estimate-journey-fields.presenter';
import { ESTIMATE_JOURNEY_QUERY, EstimateJourneyQuery } from '@features/common/journey';
import { isValidDate } from '@features/common/angular';

import { WaypointValues } from '@features/common/waypoint';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-estimate-journey-field',
  templateUrl: './estimate-journey-fields.component.html'
})
export class EstimateJourneyFields2Component {
  @Input({ required: true }) public durationFieldControl!: FormControl<number>;
  @Input({ required: true }) public distanceFieldControl!: FormControl<number>;
  // eslint-disable-next-line @typescript-eslint/no-shadow
  @Input({ required: true }) public set origin(origin: WaypointValues | null) {
    if (origin === null || !isValidPlace(origin.place)) return;

    this._origin$.next(origin);
  }
  @Input({ required: true }) public set destination(destination: WaypointValues | null) {
    if (destination === null || !isValidPlace(destination.place)) return;

    this._destination$.next(destination);
  }
  @Input({ required: true }) public set date(date: string | null) {
    if (date === null || !isValidDate(date)) return;

    this._date$.next(date);
  }

  public constructor(@Inject(ESTIMATE_JOURNEY_QUERY) private readonly _estimateJourneyQuery$: EstimateJourneyQuery) {}

  private readonly _origin$: Subject<WaypointValues> = new Subject<WaypointValues>();
  private readonly _destination$: Subject<WaypointValues> = new Subject<WaypointValues>();
  private readonly _date$: Subject<string> = new Subject<string>();

  public readonly estimateJourney$: Observable<DurationDistance> = combineLatest([
    this._origin$.asObservable(),
    this._destination$.asObservable(),
    this._date$.asObservable().pipe(debounceTime(500))
  ]).pipe(
    switchMap(
      // eslint-disable-next-line @typescript-eslint/no-shadow
      ([origin, destination, date]: [WaypointValues, WaypointValues, string]): Observable<JourneyEstimate> =>
        this._estimateJourneyQuery$(
          toJourney({ origin: origin.place, destination: destination.place, departureTime: new Date(date).toISOString() })
        )
    ),
    map(toDisplayDurationDistance),
    tap((durationDistance: DurationDistance): void => {
      this.durationFieldControl.setValue(durationDistance.duration);
      this.distanceFieldControl.setValue(durationDistance.distance);
    }),
    startWith({
      duration: 1,
      distance: 1
    })
  );
}
