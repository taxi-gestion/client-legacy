import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { REGISTER_REGULAR_ACTION, RegisterRegularAction } from '../../providers';
import {
  REGISTER_REGULAR_FORM,
  RegisterRegularFields,
  RegisterRegularPresentation,
  setRegisterRegularErrorToForm
} from './register-regular.form';
import { formatRegisterRegularError, toRegular } from './register-regular.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register-regular.page.html'
})
export class RegisterRegularPage {
  @Output() public registerRegularSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public registerRegularSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public registerRegularError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly registerRegular$ = (): Observable<object> =>
    this._registerRegularAction$(toRegular(REGISTER_REGULAR_FORM.value as RegisterRegularPresentation));

  public readonly registerRegularForm: FormGroup<RegisterRegularFields> = REGISTER_REGULAR_FORM;

  public constructor(@Inject(REGISTER_REGULAR_ACTION) private readonly _registerRegularAction$: RegisterRegularAction) {}

  public onSubmitFareToSchedule = (triggerAction: () => void): void => {
    REGISTER_REGULAR_FORM.markAllAsTouched();
    REGISTER_REGULAR_FORM.valid && triggerAction();
  };

  public onRegisterRegularActionSuccess = (): void => {
    REGISTER_REGULAR_FORM.reset();
  };

  public onRegisterRegularActionError = (error: Error): void => {
    setRegisterRegularErrorToForm(formatRegisterRegularError(error));
  };
}
