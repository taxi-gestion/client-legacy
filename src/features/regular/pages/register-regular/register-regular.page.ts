import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { REGISTER_REGULAR_ACTION, RegisterRegularAction } from '../../providers';
import { REGISTER_REGULAR_FORM, RegisterRegularFields, setRegisterRegularErrorToForm } from './register-regular.form';
import { formatRegisterRegularError, toRegisterRegular, toRegisterRegularSuccessToast } from './register-regular.presenter';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterRegular } from '@definitions';
import {
  BootstrapValidationClasses,
  bootstrapValidationClasses,
  forceControlRevalidation,
  nullToUndefined
} from '@features/common/form-validation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register-regular.page.html'
})
export class RegisterRegularPage {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Output() public registerRegularSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public registerRegularSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public registerRegularError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly registerRegular$ = (): Observable<RegisterRegular> =>
    this._registerRegularAction$(toRegisterRegular(nullToUndefined(REGISTER_REGULAR_FORM.value)));

  public readonly registerRegularForm: FormGroup<RegisterRegularFields> = REGISTER_REGULAR_FORM;

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(REGISTER_REGULAR_ACTION) private readonly _registerRegularAction$: RegisterRegularAction
  ) {}

  public onSubmitRegisterRegular = (triggerAction: () => void): void => {
    this.registerRegularForm.markAllAsTouched();
    this.registerRegularForm.valid ? triggerAction() : forceControlRevalidation(this.registerRegularForm);
  };

  public onRegisterRegularActionSuccess = async (regular: RegisterRegular): Promise<void> => {
    this.registerRegularForm.reset();
    this._toaster.toast(toRegisterRegularSuccessToast(regular));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onRegisterRegularActionError = (error: Error): void => {
    setRegisterRegularErrorToForm(formatRegisterRegularError(error));
    this._toaster.toast({
      content: `Échec de l'enregistrement : ${error.name} ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };
}
