import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { AFFECT_RETURN_FORM, AffectReturnFields, setAffectReturnErrorToForm } from './affect-return.form';
import { formatAffectReturnError, toReturnToAffectTransfer } from './affect-return.presenter';
import { AFFECT_RETURN_ACTION, AffectReturnAction, ReturnToAffectTransfer } from '@features/planning';
import { ReturnToAffectForDatePresentation } from '@features/planning/common/returns-to-affect.presentation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-affect-return',
  templateUrl: './affect-return.component.html'
})
export class AffectReturnComponent {
  @Input({ required: true }) public returnFareToAffect!: ReturnToAffectForDatePresentation;

  @Output() public affectReturnSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public affectReturnSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public affectReturnError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly affectReturn$ = (): Observable<object> =>
    this._affectReturnAction$(toReturnToAffectTransfer(AFFECT_RETURN_FORM.value as ReturnToAffectTransfer));

  public readonly affectReturnForm: FormGroup<AffectReturnFields> = AFFECT_RETURN_FORM;

  public constructor(@Inject(AFFECT_RETURN_ACTION) private readonly _affectReturnAction$: AffectReturnAction) {}

  public onSubmitReturnToAffect = (triggerAction: () => void): void => {
    AFFECT_RETURN_FORM.markAllAsTouched();
    AFFECT_RETURN_FORM.valid && triggerAction();
  };

  public onAffectReturnActionSuccess = (): void => {
    AFFECT_RETURN_FORM.reset();
  };

  public onAffectReturnActionError = (error: Error): void => {
    setAffectReturnErrorToForm(formatAffectReturnError(error));
  };
}
