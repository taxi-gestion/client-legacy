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
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { ActivatedRoute, Router } from '@angular/router';

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

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(REGISTER_REGULAR_ACTION) private readonly _registerRegularAction$: RegisterRegularAction
  ) {}

  public onSubmitFareToSchedule = (triggerAction: () => void): void => {
    REGISTER_REGULAR_FORM.markAllAsTouched();
    REGISTER_REGULAR_FORM.valid && triggerAction();
  };

  public onRegisterRegularActionSuccess = async (payload: unknown): Promise<void> => {
    REGISTER_REGULAR_FORM.reset();
    // eslint-disable-next-line no-console
    console.log('onRegisterRegularActionSuccess', payload);
    this._toaster.toast({
      content: 'Un nouveau passager a été enregistré avec succès',
      status: 'success',
      title: 'Nouveau passager régulier'
    });
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onRegisterRegularActionError = (error: Error): void => {
    setRegisterRegularErrorToForm(formatRegisterRegularError(error));
    this._toaster.toast({ content: "Échec de l'enregistrement", status: 'danger', title: 'Opération échouée' });
  };
}
