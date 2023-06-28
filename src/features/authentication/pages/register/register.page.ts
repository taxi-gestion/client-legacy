import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { REDIRECT_ROUTES_PERSISTENCE, RedirectRoutesKeys, REGISTER_ACTION, RegisterAction } from '../../providers';
import { toInternationalFormat } from '../../presentation';
import { REGISTER_FORM, setRegisterErrorToForm } from './register.form';
import { formatLoginError } from '../login/login.presenter';

type RegisterFields = {
  username: FormControl<string>;
  password: FormControl<string>;
  terms: FormControl<boolean>;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.page.html'
})
export class RegisterPage {
  public registerForm: FormGroup<RegisterFields> = REGISTER_FORM;

  public username: RegisterFields['username'] = this.registerForm.controls.username;

  public password: RegisterFields['password'] = this.registerForm.controls.password;

  private readonly _defaultUsername: string | null = this._route.snapshot.queryParamMap.get('username');

  public readonly register$ = (): Observable<void> =>
    this._registerAction$(toInternationalFormat(this.username.value), this.password.value);

  public constructor(
    @Inject(REGISTER_ACTION) private readonly _registerAction$: RegisterAction<void>,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router
  ) {
    this._defaultUsername != null && this.username.setValue(this._defaultUsername);
  }

  public onSubmitRegister = (triggerAction: () => void): void => {
    REGISTER_FORM.markAllAsTouched();
    REGISTER_FORM.valid && triggerAction();
  };

  public onRegisterActionSuccess = async (): Promise<void> => {
    REGISTER_FORM.reset();
    await this._router.navigate([this._toRoutes.get('register')], { queryParams: { username: this.username.value } });
  };

  public onRegisterActionError = (error: Error): void => {
    setRegisterErrorToForm(formatLoginError(error));
  };
}
