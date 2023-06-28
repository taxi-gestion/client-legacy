import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LIMIT_EXCEEDED_ERROR_NAME } from '../../errors';
import { REDIRECT_ROUTES_PERSISTENCE, RedirectRoutesKeys, RESET_PASSWORD_ACTION, ResetPasswordAction } from '../../providers';
import { RESET_PASSWORD_FORM, setResetPasswordErrorToForm } from './reset-password.form';
import { formatResetPasswordError } from './reset-password.presenter';

type ResetPasswordFields = {
  username: FormControl<string>;
  password: FormControl<string>;
  code: FormControl<string>;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reset-password.page.html'
})
export class ResetPasswordPage {
  public resetPasswordForm: FormGroup<ResetPasswordFields> = RESET_PASSWORD_FORM;

  public limitExceededErrorName: string = LIMIT_EXCEEDED_ERROR_NAME;

  public username: ResetPasswordFields['username'] = this.resetPasswordForm.controls.username;
  public password: ResetPasswordFields['password'] = this.resetPasswordForm.controls.password;
  public code: ResetPasswordFields['code'] = this.resetPasswordForm.controls.code;

  public readonly defaultUsername: string | null = this._route.snapshot.queryParamMap.get('username');

  public readonly resetPassword$ = (): Observable<void> =>
    this._resetPasswordAction$(this.username.value, this.code.value, this.password.value);

  public constructor(
    @Inject(RESET_PASSWORD_ACTION) private readonly _resetPasswordAction$: ResetPasswordAction,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router
  ) {
    this.defaultUsername != null && this.username.setValue(this.defaultUsername);
  }

  public onSubmitResetPassword = (triggerAction: () => void): void => {
    RESET_PASSWORD_FORM.markAllAsTouched();
    RESET_PASSWORD_FORM.valid && triggerAction();
  };

  public onResetPasswordActionSuccess = async (): Promise<void> => {
    RESET_PASSWORD_FORM.reset();
    await this._router.navigate([this._toRoutes.get('reset-password')], { queryParams: { username: this.username.value } });
  };

  public onResetPasswordActionError = (error: Error): void => {
    setResetPasswordErrorToForm(formatResetPasswordError(error));
  };
}
