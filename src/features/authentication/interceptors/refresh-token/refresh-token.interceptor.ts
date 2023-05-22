import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { catchError, EMPTY, from, Observable, ObservableInput, Subscription, switchMap, take, tap } from 'rxjs';
import {
  LOGOUT_ACTION,
  LogoutAction,
  REDIRECT_ROUTES_PERSISTENCE,
  RedirectRoutesKeys,
  REFRESH_TOKEN_ACTION,
  RefreshTokenAction,
  SESSION_PERSISTENCE,
  TokenSession
} from '../../providers';
import { Router } from '@angular/router';

export const authorizedRouteMatchPattern =
  (pattern: RegExp) =>
  (route: string): boolean =>
    route.match(pattern) != null;

const EXPIRED: 0 = 0 as const;

const EXPIRE_SOON_INTERVAL: 60000 = 60000 as const;

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private readonly _authorizedRoutePattern: RegExp = /\/api/u;

  public constructor(
    @Inject(SESSION_PERSISTENCE) private readonly _tokenSession: TokenSession,
    @Inject(REFRESH_TOKEN_ACTION) private readonly _refreshTokenAction: RefreshTokenAction<void>,
    @Inject(LOGOUT_ACTION) private readonly _logoutAction: LogoutAction,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _router: Router
  ) {}

  private logout(): ObservableInput<void> {
    this._logoutAction();
    return from(this._router.navigate([this._toRoutes.get('session-expired')])).pipe(switchMap((): Observable<void> => EMPTY));
  }

  private bearerTokenExpired(): boolean {
    return this._tokenSession.getRemainingTime() < EXPIRED;
  }

  private bearerTokenExpiresSoon(): boolean {
    return this._tokenSession.getRemainingTime() < EXPIRE_SOON_INTERVAL;
  }

  private refreshBearerTokenThenHandleRequest(
    next: HttpHandler,
    request: HttpRequest<unknown>
  ): Observable<HttpEvent<unknown>> {
    return this._refreshTokenAction().pipe(
      catchError(this.logout.bind(this)),
      switchMap((): Observable<HttpEvent<unknown>> => next.handle(request))
    );
  }

  private refreshBearerTokenAndHandleRequest(next: HttpHandler, request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(tap((): Subscription => this._refreshTokenAction().pipe(take(1)).subscribe()));
  }

  private handleBearerTokenExpiration(next: HttpHandler, request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    if (this.bearerTokenExpiresSoon()) {
      return this.refreshBearerTokenAndHandleRequest(next, request);
    }

    if (this.bearerTokenExpired()) {
      return this.refreshBearerTokenThenHandleRequest(next, request);
    }

    return next.handle(request);
  }

  public intercept = (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> =>
    authorizedRouteMatchPattern(this._authorizedRoutePattern)(request.url)
      ? this.handleBearerTokenExpiration(next, request)
      : next.handle(request);
}
