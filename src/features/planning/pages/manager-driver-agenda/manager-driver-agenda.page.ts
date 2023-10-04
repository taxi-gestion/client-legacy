import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { combineLatest, map, Observable, of, Subject, switchMap, take } from 'rxjs';
import { DRIVER_AGENDA_FOR_DATE_QUERY, DriverAgendaForDateQuery } from '@features/planning';
import { Session, SESSION_PERSISTENCE } from '../../../authentication';
import { toScheduledFaresPresentation } from '../../common/fares.presenter';
import { toStandardDateFormat } from '../../common/unit-convertion';
import { Driver, Entity, Scheduled } from '@definitions';
import { driverEmptyValue, DriverValues, LIST_DRIVERS_QUERY, ListDriversQuery, toDriversValues } from '@features/common/driver';
import { FormControl } from '@angular/forms';
import { FareDriverCardPresentation, toAgendaFares } from '../../common/agenda.presenter';
import { sortByDatetime } from '../../common/time.presenter';

const paramsToDateString = (params: Params): string =>
  params['date'] == null ? toStandardDateFormat(new Date()) : (params['date'] as string);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manager-driver-agenda.page.html'
})
export class ManagerDriverAgendaPage {
  public planningDate: string = paramsToDateString(this._route.snapshot.params);

  public driverControl: FormControl<DriverValues> = new FormControl(driverEmptyValue, { nonNullable: true });

  private readonly _selectedDriver: Subject<DriverValues> = new Subject<DriverValues>();

  public onDriverSelectedChange(driver: DriverValues): void {
    this._selectedDriver.next(driver);
  }

  public readonly drivers$: Observable<DriverValues[]> = of([]).pipe(
    switchMap((): Observable<(Driver & Entity)[]> => this._listDriversQuery()),
    take(1),
    map(toDriversValues)
  );

  public readonly fares$: Observable<FareDriverCardPresentation[]> = combineLatest([
    this._route.params,
    this._selectedDriver.asObservable()
  ]).pipe(
    switchMap(
      ([params, driver]: [Params, DriverValues]): Observable<(Entity & Scheduled)[]> =>
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        this._driverAgendaForDateQuery({ driver: { id: driver.id }, date: paramsToDateString(params) })
    ),
    map(toScheduledFaresPresentation),
    map(toAgendaFares),
    map(sortByDatetime)
  );

  public userOrFirstDriver$: Observable<DriverValues> = this.drivers$.pipe(
    map(
      (drivers: DriverValues[]): DriverValues =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        drivers.find((driver: DriverValues): boolean => this._session.userId() === driver.id) ?? drivers[0]!
    )
  );

  public constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(DRIVER_AGENDA_FOR_DATE_QUERY) private readonly _driverAgendaForDateQuery: DriverAgendaForDateQuery,
    @Inject(SESSION_PERSISTENCE) private readonly _session: Session,
    @Inject(LIST_DRIVERS_QUERY) private readonly _listDriversQuery: ListDriversQuery
  ) {}

  public async onPlanningDateChange(planningDate: string): Promise<void> {
    await this._router.navigate(['planning', 'agenda', planningDate]);
  }
}
