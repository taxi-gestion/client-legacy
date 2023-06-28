import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LIMIT_EXCEEDED_ERROR_NAME } from '../../errors';
import { FORGOT_PASSWORD_ACTION, ForgotPasswordAction, REDIRECT_ROUTES_PERSISTENCE, RedirectRoutesKeys } from '../../providers';
import { FORGOT_PASSWORD_FORM } from './forgot-password.form';
import { formatLoginError } from '../login/login.presenter';
import { setRegisterErrorToForm } from '../register/register.form';

type ForgotPasswordFields = {
  username: FormControl<string>;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forgot-password.page.html'
})
export class ForgotPasswordPage {
  public limitExceededErrorName: string = LIMIT_EXCEEDED_ERROR_NAME;

  public forgotPasswordForm: FormGroup<ForgotPasswordFields> = FORGOT_PASSWORD_FORM;

  public username: ForgotPasswordFields['username'] = this.forgotPasswordForm.controls.username;

  private readonly _defaultUsername: string | null = this._route.snapshot.queryParamMap.get('username');

  public readonly forgotPassword$ = (): Observable<void> => this._forgotPasswordAction$(this.username.value);

  public constructor(
    @Inject(FORGOT_PASSWORD_ACTION) private readonly _forgotPasswordAction$: ForgotPasswordAction,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router
  ) {
    this._defaultUsername != null && this.username.setValue(this._defaultUsername);
  }

  public onSubmitForgotPassword = (triggerAction: () => void): void => {
    FORGOT_PASSWORD_FORM.markAllAsTouched();
    FORGOT_PASSWORD_FORM.valid && triggerAction();
  };

  public onForgotPasswordActionSuccess = async (): Promise<void> => {
    FORGOT_PASSWORD_FORM.reset();
    await this._router.navigate([
      this._router.navigate([this._toRoutes.get('forgot-password')], { queryParams: { username: this.username.value } })
    ]);
  };

  public onForgotPasswordActionError = (error: Error): void => {
    setRegisterErrorToForm(formatLoginError(error));
  };
}
