import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Session, SESSION_PERSISTENCE } from '@features/authentication';
import { from, Observable, of } from 'rxjs';

@Injectable()
export class RedirectUsersByGroupGuard {
  public constructor(@Inject(SESSION_PERSISTENCE) private readonly _session: Session, private readonly _router: Router) {}

  public canActivate = (route: ActivatedRouteSnapshot): Observable<boolean> => {
    const userGroups: string[] = this._session.groups();

    if (hasNoGroups(userGroups)) return navigateToMissingAdminConfiguration(this._router);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (isDeveloper(userGroups)) return of(true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (isManager(userGroups)) return of(true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (isDriver(userGroups)) return navigateToAgenda(this._router)(route.params['date']);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (isBilling(userGroups)) return navigateToBilling(this._router)(route.params['date']);

    return of(false);
  };
}

const hasNoGroups = (userGroups: string[]): userGroups is [] => userGroups.length === 0;
const isDeveloper = (userGroups: string[]): boolean => userGroups.includes('developer');
const isManager = (userGroups: string[]): boolean => userGroups.includes('manager');
const isDriver = (userGroups: string[]): boolean => userGroups.includes('driver');
const isBilling = (userGroups: string[]): boolean => userGroups.includes('billing');

const navigateToMissingAdminConfiguration = (router: Router): Observable<boolean> =>
  from(router.navigate(['/missing-user-group']));

const navigateToAgenda =
  (router: Router) =>
  (date: string | undefined): Observable<boolean> =>
    date == null ? from(router.navigate(['/planning/agenda/'])) : from(router.navigate(['/planning/agenda/', date]));

const navigateToBilling =
  (router: Router) =>
  (date: string | undefined): Observable<boolean> =>
    date == null ? from(router.navigate(['/billing/'])) : from(router.navigate(['/billing/', date]));
