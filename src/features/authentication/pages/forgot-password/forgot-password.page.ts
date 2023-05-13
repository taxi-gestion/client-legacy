import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, from, map, mergeWith, Observable, Subject, switchMap, tap } from 'rxjs';
import { LIMIT_EXCEEDED_ERROR_NAME } from '../../errors';
import { START_LOADING, STOP_LOADING, whileLoading } from '../../presentation';
import { FORGOT_PASSWORD_ACTION, ForgotPasswordAction, REDIRECT_ROUTES_PERSISTENCE, RedirectRoutesKeys } from '../../providers';
import { FORGOT_PASSWORD_FORM, ForgotPasswordForm, setForgotPasswordErrorToForm } from './forgot-password.form';
import { formatForgotPasswordError } from './forgot-password.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forgot-password.page.html'
})
export class ForgotPasswordPage {
  private readonly _isLoading$: Subject<boolean> = new Subject<boolean>();

  public limitExceededErrorName: string = LIMIT_EXCEEDED_ERROR_NAME;

  public forgotPasswordForm = FORGOT_PASSWORD_FORM;

  public username: FormControl<ForgotPasswordForm['username']> = this.forgotPasswordForm.controls.username;

  private readonly _defaultUsername: string | null = this._route.snapshot.queryParamMap.get('username');

  private handleForgotPasswordActionError = (error: Error, caught: Observable<void>): Observable<void> => {
    setForgotPasswordErrorToForm(formatForgotPasswordError(error));
    this._isLoading$.next(STOP_LOADING);
    return caught;
  };

  private readonly _forgotPassword$: Observable<boolean> = this._isLoading$.pipe(
    switchMap(whileLoading(() => this._forgotPasswordAction$(this.username.value))),
    catchError(this.handleForgotPasswordActionError),
    tap(() =>
      from(this._router.navigate([this._toRoutes.get('forgot-password')], { queryParams: { username: this.username.value } }))
    ),
    tap(() => FORGOT_PASSWORD_FORM.reset()),
    map(() => STOP_LOADING)
  );

  public readonly isLoading$: Observable<boolean> = this._isLoading$.pipe(mergeWith(this._forgotPassword$));

  public constructor(
    @Inject(FORGOT_PASSWORD_ACTION) private readonly _forgotPasswordAction$: ForgotPasswordAction,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router
  ) {
    this._defaultUsername && this.username.setValue(this._defaultUsername);
  }

  public onForgotPassword = (): void => {
    FORGOT_PASSWORD_FORM.markAllAsTouched();
    FORGOT_PASSWORD_FORM.valid && this._isLoading$.next(START_LOADING);
  };
}
