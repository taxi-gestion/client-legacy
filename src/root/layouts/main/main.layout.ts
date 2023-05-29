import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  LOGOUT_ACTION,
  LogoutAction,
  REDIRECT_ROUTES_PERSISTENCE,
  RedirectRoutesKeys,
  Serializable,
  SESSION_PERSISTENCE,
  TokenSession
} from '@features/authentication';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main.layout.html'
})
export class MainLayout {
  public constructor(
    @Inject(SESSION_PERSISTENCE) private readonly _tokenSession: TokenSession,
    @Inject(LOGOUT_ACTION) private readonly logoutAction: LogoutAction,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _router: Router
  ) {}

  public async onLogout(): Promise<void> {
    this.logoutAction();
    await this._router.navigate([this._toRoutes.get('logout')], { onSameUrlNavigation: 'reload' });
  }

  public userFromToken(): {
    username: Serializable;
    groups: Serializable;
  } {
    return {
      username: this._tokenSession.getFromPayload('username'),
      groups: this._tokenSession.getFromPayload('cognito:groups')
    };
  }
}
