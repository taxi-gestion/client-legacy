import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LOGOUT_ACTION, LogoutAction, REDIRECT_ROUTES_PERSISTENCE, RedirectRoutesKeys } from '@features/authentication';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main.layout.html'
})
export class MainLayout {
  public constructor(
    @Inject(LOGOUT_ACTION) private readonly logoutAction: LogoutAction,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _router: Router
  ) {}

  public onLogout(): void {
    this.logoutAction();
    this._router.navigate([this._toRoutes.get('logout')], { onSameUrlNavigation: 'reload' });
  }
}
