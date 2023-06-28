import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isAccountNotActivatedError } from '../../errors';
import { toInternationalFormat } from '../../presentation';
import { LOGIN_ACTION, LoginAction, REDIRECT_ROUTES_PERSISTENCE, RedirectRoutesKeys } from '../../providers';
import { LOGIN_FORM, setLoginErrorToForm } from './login.form';
import { formatLoginError } from './login.presenter';

type LoginFields = {
  username: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.page.html'
})
export class LoginPage {
  public loginForm: FormGroup<LoginFields> = LOGIN_FORM;

  public username: LoginFields['username'] = this.loginForm.controls.username;

  public password: LoginFields['password'] = this.loginForm.controls.password;

  private readonly _defaultUsername: string | null = this._route.snapshot.queryParamMap.get('username');

  private async needAccountActivation(): Promise<void> {
    await this._router.navigate([this._toRoutes.get('not-activated')], { queryParams: { username: this.username.value } });
  }

  public readonly login$ = (): Observable<void> =>
    this._loginAction$(toInternationalFormat(this.username.value), this.password.value);

  public constructor(
    @Inject(LOGIN_ACTION) private readonly _loginAction$: LoginAction<void>,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router
  ) {
    this._defaultUsername != null && this.username.setValue(this._defaultUsername);
  }

  public onSubmitLogin = (triggerAction: () => void): void => {
    LOGIN_FORM.markAllAsTouched();
    LOGIN_FORM.valid && triggerAction();
  };

  public onLoginActionSuccess = async (): Promise<void> => {
    LOGIN_FORM.reset();
    await this._router.navigate([this._toRoutes.get('login')]);
  };

  public onLoginActionError = async (error: Error): Promise<void> => {
    isAccountNotActivatedError(error) ? await this.needAccountActivation() : setLoginErrorToForm(formatLoginError(error));
  };
}
