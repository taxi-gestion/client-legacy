import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { REGISTER_REGULAR_ACTION, RegisterRegularAction } from '../../providers';
import {
  REGISTER_REGULAR_FORM,
  RegisterRegularFields,
  RegisterRegularPresentation,
  setRegisterRegularErrorToForm
} from './register-regular.form';
import { formatRegisterRegularError, toRegisterRegularSuccessToast, toRegularDetails } from './register-regular.presenter';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { ActivatedRoute, Router } from '@angular/router';
import { RegularRegistered } from '@definitions';
import { PhoneNumberFields, PhoneNumberValues } from '../../components/regular/phone-numbers.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register-regular.page.html'
})
export class RegisterRegularPage {
  @Output() public registerRegularSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public registerRegularSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public registerRegularError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly registerRegular$ = (): Observable<RegularRegistered> =>
    this._registerRegularAction$(toRegularDetails(REGISTER_REGULAR_FORM.value as RegisterRegularPresentation));

  public readonly registerRegularForm: FormGroup<RegisterRegularFields> = REGISTER_REGULAR_FORM;

  // TODO Search and edit
  public phones$: Observable<PhoneNumberValues[]> = of([]);

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(REGISTER_REGULAR_ACTION) private readonly _registerRegularAction$: RegisterRegularAction
  ) {}

  // form-binding
  public updatePhonesFields($event: FormArray<FormGroup<PhoneNumberFields>>): void {
    this.registerRegularForm.controls.phones = $event;
  }
  // endregion

  // register-regular
  public onSubmitRegisterRegular = (triggerAction: () => void): void => {
    this.registerRegularForm.markAllAsTouched();
    this.registerRegularForm.valid && triggerAction();
  };

  public onRegisterRegularActionSuccess = async (regular: RegularRegistered): Promise<void> => {
    this.registerRegularForm.reset();
    this._toaster.toast(toRegisterRegularSuccessToast(regular));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onRegisterRegularActionError = (error: Error): void => {
    setRegisterRegularErrorToForm(formatRegisterRegularError(error));
    this._toaster.toast({ content: "Échec de l'enregistrement", status: 'danger', title: 'Opération échouée' });
  };
  // endregion

  public getPhones(): FormArray {
    return this.registerRegularForm.controls.phones;
  }
}
