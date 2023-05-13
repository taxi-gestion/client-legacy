import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, from, map, mergeWith, Observable, Subject, switchMap, tap } from 'rxjs';
import { LIMIT_EXCEEDED_ERROR_NAME } from '../../errors';
import { START_LOADING, STOP_LOADING, whileLoading } from '../../presentation';
import { RESET_PASSWORD_ACTION, ResetPasswordAction, REDIRECT_ROUTES_PERSISTENCE, RedirectRoutesKeys } from '../../providers';
import { RESET_PASSWORD_FORM, ResetPasswordForm, setResetPasswordErrorToForm } from './reset-password.form';
import { formatResetPasswordError } from './reset-password.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reset-password.page.html'
})
export class ResetPasswordPage {
  private readonly _isLoading$: Subject<boolean> = new Subject<boolean>();

  public resetPasswordForm = RESET_PASSWORD_FORM;

  public limitExceededErrorName: string = LIMIT_EXCEEDED_ERROR_NAME;

  public username: FormControl<ResetPasswordForm['username']> = this.resetPasswordForm.controls.username;
  public password: FormControl<ResetPasswordForm['password']> = this.resetPasswordForm.controls.password;
  public code: FormControl<ResetPasswordForm['code']> = this.resetPasswordForm.controls.code;

  public readonly defaultUsername: string | null = this._route.snapshot.queryParamMap.get('username');

  private handleResetPasswordActionError = (error: Error, caught: Observable<void>): Observable<void> => {
    setResetPasswordErrorToForm(formatResetPasswordError(error));
    this._isLoading$.next(STOP_LOADING);
    return caught;
  };

  private readonly _resetPassword$: Observable<boolean> = this._isLoading$.pipe(
    switchMap(whileLoading(() => this._resetPasswordAction$(this.username.value, this.code.value, this.password.value))),
    catchError(this.handleResetPasswordActionError),
    tap(() =>
      from(this._router.navigate([this._toRoutes.get('reset-password')], { queryParams: { username: this.username.value } }))
    ),
    tap(() => RESET_PASSWORD_FORM.reset()),
    map(() => STOP_LOADING)
  );

  public readonly isLoading$: Observable<boolean> = this._isLoading$.pipe(mergeWith(this._resetPassword$));

  public constructor(
    @Inject(RESET_PASSWORD_ACTION) private readonly _resetPasswordAction$: ResetPasswordAction,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router
  ) {
    this.defaultUsername && this.username.setValue(this.defaultUsername);
  }

  public onResetPassword = (): void => {
    RESET_PASSWORD_FORM.markAllAsTouched();
    RESET_PASSWORD_FORM.valid && this._isLoading$.next(START_LOADING);
  };
}
