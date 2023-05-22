import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, map, Observable } from 'rxjs';
import {
  LOGOUT_ACTION,
  LogoutAction,
  REDIRECT_ROUTES_PERSISTENCE,
  RedirectRoutesKeys,
  REFRESH_TOKEN_ACTION,
  RefreshTokenAction,
  SESSION_PERSISTENCE,
  TokenSession
} from '../providers';

@Injectable()
export class CanMatchRefreshTokenGuard {
  public constructor(
    @Inject(SESSION_PERSISTENCE) private readonly _session: TokenSession,
    @Inject(LOGOUT_ACTION) private readonly logoutAction: LogoutAction,
    @Inject(REFRESH_TOKEN_ACTION) private readonly _refreshTokenAction$: RefreshTokenAction<void>,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _router: Router
  ) {}

  public canMatch = (): Observable<boolean> | boolean =>
    this._session.isLoggedIn || this._session.getRefresh() == null
      ? true
      : this._refreshTokenAction$().pipe(
          catchError((): Observable<boolean> => {
            this.logoutAction();
            return from(this._router.navigate([this._toRoutes.get('session-expired')])).pipe(map((): true => true));
          }),
          map((): true => true)
        );
}
