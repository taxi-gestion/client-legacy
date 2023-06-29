import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SESSION_PERSISTENCE, Session } from '@features/authentication';
import { from, Observable, of } from 'rxjs';

@Injectable()
export class CanActivatePlanningRedirectGuard {
  public constructor(@Inject(SESSION_PERSISTENCE) private readonly _session: Session, private readonly _router: Router) {}

  public canActivate = (route: ActivatedRouteSnapshot): Observable<boolean> => {
    const userGroups: string[] = this._session.groups();

    if (hasNoGroups(userGroups)) return navigateToMissingAdminConfiguration(this._router);

    if (isBothManagerAndDriver(userGroups)) return navigateToChoicePage(this._router);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (isManager(userGroups)) return navigateToDaily(this._router)(route.params['date']);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (isDriver(userGroups)) return navigateToAgenda(this._router)(route.params['date']);

    return of(false);
  };
}

const hasNoGroups = (userGroups: string[]): userGroups is [] => userGroups.length === 0;
const isManager = (userGroups: string[]): boolean => userGroups.includes('manager');
const isDriver = (userGroups: string[]): boolean => userGroups.includes('driver');
const isBothManagerAndDriver = (userGroups: string[]): boolean => isManager(userGroups) && isDriver(userGroups);
const navigateToMissingAdminConfiguration = (router: Router): Observable<boolean> =>
  from(router.navigate(['/planning/missing-admin-configuration']));
const navigateToChoicePage = (router: Router): Observable<boolean> => from(router.navigate(['/planning/planning-or-agenda']));
const navigateToDaily =
  (router: Router) =>
  (date: string | undefined): Observable<boolean> =>
    date == null ? from(router.navigate(['/planning/daily/'])) : from(router.navigate(['/planning/daily/', date]));

const navigateToAgenda =
  (router: Router) =>
  (date: string | undefined): Observable<boolean> =>
    date == null ? from(router.navigate(['/planning/agenda/'])) : from(router.navigate(['/planning/agenda/', date]));
