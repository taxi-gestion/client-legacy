import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, mergeWith, Observable, Subject, switchMap } from 'rxjs';
import { START_LOADING, STOP_LOADING, whileLoading } from '@features/common/load';
import { toInternationalFormat } from '../../presentation';
import {
  ACTIVATE_ACTION,
  ActivateAction,
  REDIRECT_ROUTES_PERSISTENCE,
  RedirectRoutesKeys,
  RESEND_ACTIVATION_CODE_ACTION,
  ResendActivationCodeAction
} from '../../providers';
import { ACTIVATE_FORM, setActivateErrorToForm } from './activate.form';
import { activationCodeErrorMessageFrom, formatActivateError } from './activate.presenter';

type ActivateFields = {
  code: FormControl<string>;
  username: FormControl<string>;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activate.page.html'
})
export class ActivatePage {
  private readonly _isSendingActivationCode$: Subject<boolean> = new Subject<boolean>();

  private readonly _resendActivationCodeErrorMessage$: Subject<string> = new Subject<string>();
  public readonly resendActivationCodeErrorMessage$: Observable<string> =
    this._resendActivationCodeErrorMessage$.asObservable();

  public activateForm: FormGroup<ActivateFields> = ACTIVATE_FORM;

  public username: ActivateFields['username'] = this.activateForm.controls.username;

  public code: ActivateFields['code'] = this.activateForm.controls.code;

  public readonly defaultUsername: string | null = this._route.snapshot.queryParamMap.get('username');

  public readonly defaultCode: string | null = this._route.snapshot.queryParamMap.get('code');

  private resendActivationCodeActionError(error: Error, caught: Observable<void>): Observable<void> {
    this._resendActivationCodeErrorMessage$.next(activationCodeErrorMessageFrom(error));
    this._isSendingActivationCode$.next(STOP_LOADING);
    return caught;
  }

  public readonly activate$ = (): Observable<object> =>
    this._activateAction$(toInternationalFormat(this.username.value), this.code.value);

  private readonly _resendActivationCode$: Observable<boolean> = this._isSendingActivationCode$.pipe(
    switchMap(
      whileLoading((): Observable<void> => this._resendActivationCodeAction$(toInternationalFormat(this.username.value)))
    ),
    catchError(this.resendActivationCodeActionError.bind(this)),
    map((): boolean => STOP_LOADING)
  );
  public readonly isSendingActivationCode$: Observable<boolean> = this._isSendingActivationCode$.pipe(
    mergeWith(this._resendActivationCode$)
  );

  public constructor(
    @Inject(ACTIVATE_ACTION) private readonly _activateAction$: ActivateAction,
    @Inject(RESEND_ACTIVATION_CODE_ACTION) private readonly _resendActivationCodeAction$: ResendActivationCodeAction,
    @Inject(REDIRECT_ROUTES_PERSISTENCE) private readonly _toRoutes: Map<RedirectRoutesKeys, string>,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router
  ) {
    this.defaultUsername != null && this.username.setValue(this.defaultUsername);
    this.defaultCode != null && this.code.setValue(this.defaultCode);
  }

  public onResendActivationCode(): void {
    this._isSendingActivationCode$.next(START_LOADING);
    this._resendActivationCodeErrorMessage$.next('');
  }

  public onSubmitActivate = (triggerAction: () => void): void => {
    ACTIVATE_FORM.markAllAsTouched();
    ACTIVATE_FORM.valid && triggerAction();
  };

  public onActivateActionSuccess = async (): Promise<void> => {
    ACTIVATE_FORM.reset();
    await this._router.navigate([this._toRoutes.get('activate')]);
  };

  public onActivateActionError = (error: Error): void => {
    setActivateErrorToForm(formatActivateError(error));
  };
}
