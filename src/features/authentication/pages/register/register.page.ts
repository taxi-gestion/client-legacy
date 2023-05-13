import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, from, map, mergeWith, Observable, Subject, switchMap, tap } from 'rxjs';
import { RegisterAction, REGISTER_ACTION, REDIRECT_ROUTES_PERSISTENCE, RedirectRoutesKeys } from '../../providers';
import { START_LOADING, STOP_LOADING, toInternationalFormat, whileLoading } from '../../presentation';
import { formatRegisterError } from './register.presenter';
import { REGISTER_FORM, RegisterFormValues, setRegisterErrorToForm } from './register.form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.page.html'
})
export class RegisterPage {
  private readonly _isLoading$: Subject<boolean> = new Subject<boolean>();

  public registerForm: FormGroup<Record<keyof RegisterFormValues, FormControl>> = REGISTER_FORM;

  public username: FormControl<RegisterFormValues['username']> = this.registerForm.controls.username;

  public password: FormControl<RegisterFormValues['password']> = this.registerForm.controls.password;

  private readonly _defaultUsername: string | null = this._route.snapshot.queryParamMap.get('username');

  private handleRegisterActionError = (error: Error, caught: Observable<void>): Observable<void> => {
    setRegisterErrorToForm(formatRegisterError(error));
    this._isLoading$.next(STOP_LOADING);
    return caught;
  };

  private readonly _register$: Observable<boolean> = this._isLoading$.pipe(
    switchMap(whileLoading(() => this._registerAction$(toInternationalFormat(this.username.value), this.password.value))),
    catchError(this.handleRegisterActionError),
    tap(() =>
      from(this._router.navigate([this._toRoutes.get('register')], { queryParams: { username: this.username.value } }))
    ),
    tap(() => REGISTER_FORM.reset()),
    map(() => STOP_LOADING)
  );

  public readonly isLoading$: Observable<boolean> = this._isLoading$.pipe(mergeWith(this._register$));

  public constructor(
    @Inject(REGISTER_ACTION) private readonly _registerAction$: RegisterAction<void>,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router
  ) {
    this._defaultUsername && this.username.setValue(this._defaultUsername);
  }

  public onRegister = (): void => {
    REGISTER_FORM.markAllAsTouched();
    REGISTER_FORM.valid && this._isLoading$.next(START_LOADING);
  };
}
