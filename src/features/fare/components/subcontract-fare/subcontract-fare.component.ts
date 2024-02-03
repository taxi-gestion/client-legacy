import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, SubcontractFare, Subcontractor, ToSubcontracted } from '../../../../definitions';
import { pipe as fpipe } from 'fp-ts/function';
import { BootstrapValidationClasses, bootstrapValidationClasses, nullToUndefined } from '../../../common/form-validation';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import {
  subcontractFareFormDecode,
  toSubcontractFareSuccessToast,
  toToSubcontractedDecode,
  toToSubcontractedEncode
} from './subcontract-fare.presenter';
import { toDomainGateway } from '../../../../codecs/gateway';
import { ToSubcontractValues } from './subcontract-fare.form';
import { fold } from 'fp-ts/Either';
import { Errors } from '../../../../codecs';
import { DecodeError } from '../../../common/form-validation/errors/decode.error';
import { SUBCONTRACT_FARE_ACTION, SubcontractFareAction } from '../../providers';

type SubcontractFareFields = {
  subcontractor: FormControl<string | null>;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subcontract-fare.component.html',
  selector: 'app-subcontract-fare'
})
export class SubcontractFareComponent {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Input({ required: true }) public fareId!: string;

  @Output() public faresUpdated: EventEmitter<void> = new EventEmitter<void>();

  public subcontractFareForm: FormGroup<SubcontractFareFields> = new FormGroup({
    subcontractor: new FormControl<Subcontractor['identity']>('', [Validators.required])
  });

  public constructor(
    private readonly _toaster: ToasterPresenter,
    @Inject(SUBCONTRACT_FARE_ACTION) private readonly _subcontractFareAction$: SubcontractFareAction
  ) {}
  public readonly subcontractFare$ = (): Observable<SubcontractFare> =>
    fpipe(
      nullToUndefined({
        ...this.subcontractFareForm.value,
        id: this.fareId
      }),
      toDomainGateway<Entity & ToSubcontractValues, Entity & ToSubcontracted>(
        subcontractFareFormDecode,
        toToSubcontractedEncode,
        toToSubcontractedDecode
      ),
      fold((errors: Errors): never => {
        throw new DecodeError('Error in domain gateway', { cause: errors });
      }, this._subcontractFareAction$)
    );

  public onSubcontractFareActionSuccess = (fare: SubcontractFare): void => {
    this.subcontractFareForm.reset();
    this._toaster.toast(toSubcontractFareSuccessToast(fare));
    this.faresUpdated.emit();
  };

  public onSubcontractFareActionError = (error: Error): void => {
    this._toaster.toast({
      content: `Échec de la sous traitance: ${error.name} | ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };

  public onSubmit = (triggerAction: () => void): void => {
    this.subcontractFareForm.markAllAsTouched();
    triggerAction();
  };
}
