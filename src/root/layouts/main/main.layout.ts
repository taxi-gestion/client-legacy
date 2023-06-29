import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  LOGOUT_ACTION,
  LogoutAction,
  REDIRECT_ROUTES_PERSISTENCE,
  RedirectRoutesKeys,
  SESSION_PERSISTENCE,
  Session
} from '@features/authentication';
import { userFromSession } from './main.presenter';
import type { UserPresentation } from './main.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main.layout.html'
})
export class MainLayout {
  public readonly user: UserPresentation = userFromSession(this._tokenSession);

  public constructor(
    @Inject(SESSION_PERSISTENCE) private readonly _tokenSession: Session,
    @Inject(LOGOUT_ACTION) private readonly logoutAction: LogoutAction,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _router: Router
  ) {}

  public async onLogout(): Promise<void> {
    this.logoutAction();
    await this._router.navigate([this._toRoutes.get('logout')], { onSameUrlNavigation: 'reload' });
  }
}
