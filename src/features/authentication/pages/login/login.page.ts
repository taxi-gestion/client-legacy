import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, from, map, mergeWith, Observable, Subject, switchMap, tap } from 'rxjs';
import { isAccountNotActivatedError } from '@features/authentication';
import { START_LOADING, STOP_LOADING, toInternationalFormat, whileLoading } from '../../presentation';
import { LOGIN_ACTION, LoginAction, REDIRECT_ROUTES_PERSISTENCE, RedirectRoutesKeys } from '../../providers';
import { LOGIN_FORM, LoginFormValues, setLoginErrorToForm } from './login.form';
import { formatLoginError } from './login.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.page.html'
})
export class LoginPage {
  private readonly _isLoading$: Subject<boolean> = new Subject<boolean>();

  public loginForm: FormGroup<Record<keyof LoginFormValues, FormControl>> = LOGIN_FORM;

  public username: FormControl<LoginFormValues['username']> = this.loginForm.controls.username;

  public password: FormControl<LoginFormValues['password']> = this.loginForm.controls.password;

  private readonly _defaultUsername: string | null = this._route.snapshot.queryParamMap.get('username');

  private handleLoginActionError = (error: Error, caught: Observable<void>): Observable<void> => {
    isAccountNotActivatedError(error) ? this.needAccountActivation() : setLoginErrorToForm(formatLoginError(error));
    this._isLoading$.next(STOP_LOADING);
    return caught;
  };

  private needAccountActivation() {
    this._router.navigate([this._toRoutes.get('not-activated')], { queryParams: { username: this.username.value } });
  }

  private readonly _login$: Observable<boolean> = this._isLoading$.pipe(
    switchMap(whileLoading(() => this._loginAction$(toInternationalFormat(this.username.value), this.password.value))),
    catchError(this.handleLoginActionError),
    tap(() => from(this._router.navigate([this._toRoutes.get('login')]))),
    tap(() => LOGIN_FORM.reset()),
    map(() => STOP_LOADING)
  );

  public readonly isLoading$: Observable<boolean> = this._isLoading$.pipe(mergeWith(this._login$));

  public constructor(
    @Inject(LOGIN_ACTION) private readonly _loginAction$: LoginAction<void>,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router
  ) {
    this._defaultUsername && this.username.setValue(this._defaultUsername);
  }

  public onLogin = (): void => {
    LOGIN_FORM.markAllAsTouched();
    LOGIN_FORM.valid && this._isLoading$.next(START_LOADING);
  };
}
