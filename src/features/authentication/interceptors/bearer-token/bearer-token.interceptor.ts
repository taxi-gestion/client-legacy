import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SESSION_PERSISTENCE, TokenSession } from '../../providers';

const requestWithBearerToken = (request: HttpRequest<unknown>, token: string): HttpRequest<unknown> =>
  request.clone({
    setHeaders: {
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      Authorization: `Bearer ${token}`
    }
  });

export const authorizedRouteMatchPattern =
  (pattern: RegExp) =>
  (route: string): boolean =>
    route.match(pattern) != null;

export const isValidToken = (token: string | null): token is string => token != null;

@Injectable()
export class BearerTokenInterceptor implements HttpInterceptor {
  private readonly _authorizedRoutePattern: RegExp = /\/api/u;

  public constructor(@Inject(SESSION_PERSISTENCE) private readonly _tokenSession: TokenSession) {}

  private shouldForwardBearerToken(request: HttpRequest<unknown>, token: string | null): token is string {
    return isValidToken(token) && authorizedRouteMatchPattern(this._authorizedRoutePattern)(request.url);
  }

  public intercept = (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> => {
    const token: string | null = this._tokenSession.getAccess();
    return next.handle(this.shouldForwardBearerToken(request, token) ? requestWithBearerToken(request, token) : request);
  };
}
