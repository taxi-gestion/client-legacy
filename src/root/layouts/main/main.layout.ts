import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  LOGOUT_ACTION,
  LogoutAction,
  REDIRECT_ROUTES_PERSISTENCE,
  RedirectRoutesKeys,
  SESSION_PERSISTENCE,
  TokenSession
} from '@features/authentication';
import { userFromSession } from './main.presenter';
import type { UserPresentation } from './main.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main.layout.html'
})
export class MainLayout {
  // TODO Remove and pass in constructor https://github.com/taxi-gestion/client/actions/runs/5130670509/jobs/9229755079
  public readonly user: UserPresentation;
  public constructor(
    @Inject(SESSION_PERSISTENCE) private readonly _tokenSession: TokenSession,
    @Inject(LOGOUT_ACTION) private readonly logoutAction: LogoutAction,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _router: Router
  ) {
    this.user = userFromSession(this._tokenSession);
  }

  public async onLogout(): Promise<void> {
    this.logoutAction();
    await this._router.navigate([this._toRoutes.get('logout')], { onSameUrlNavigation: 'reload' });
  }
}
