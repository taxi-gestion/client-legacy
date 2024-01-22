import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PatchRegularFields } from '../../common/regular.presentation';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { PATCH_REGULAR_ACTION, PatchRegularAction } from '../../providers';
import { Observable } from 'rxjs';
import { Entity, PatchRegular, RegularPatchableProperties } from '../../../../definitions';
import { pipe as fpipe } from 'fp-ts/function';
import { nullToUndefined } from '../../../common/form-validation';
import { toDomainGateway } from '../../../../codecs/gateway';
import { fold } from 'fp-ts/Either';
import { Errors } from '../../../../codecs';
import { DecodeError } from '../../../common/form-validation/errors/decode.error';
import {
  regularPatchFormDecode,
  toPatchRegularSuccessToast,
  toRegularPatchablePropertiesDecode,
  toRegularPatchablePropertiesEncode
} from './regular-patch.presenter';
import { RegularPatchableValues } from '../regular.form';
import { RegularValues } from '../../definitions';
import { toRegularValues } from '../../common/regular.presenter';
import { PhoneFields, phoneFormControl } from '../../../common/phone';
import { waypointFormControl } from '../../../common/waypoint/components/waypoint/waypoint.form';
import { WaypointFields } from '../../../common/waypoint';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-regular-patch',
  templateUrl: './regular-patch.component.html'
})
export class RegularPatchComponent implements OnInit {
  @Input({ required: true }) public id!: string;
  @Input({ required: true }) public property!: 'phones' | 'waypoints';

  @Output() public regularUpdated: EventEmitter<Entity & RegularValues> = new EventEmitter<Entity & RegularValues>();

  public patchRegularForm!: FormGroup<PatchRegularFields>;

  public constructor(
    private readonly _toaster: ToasterPresenter,
    @Inject(PATCH_REGULAR_ACTION) private readonly _patchRegularAction$: PatchRegularAction
  ) {}

  public ngOnInit(): void {
    this.patchRegularForm = new FormGroup({
      ...(this.property === 'phones' ? phoneFormControl('phone') : waypointFormControl('waypoint'))
    });
  }

  public readonly patchRegular$ = (): Observable<PatchRegular> =>
    fpipe(
      nullToUndefined({
        ...this.patchRegularForm.value,
        id: this.id
      }),
      toDomainGateway<Entity & RegularPatchableValues, Entity & RegularPatchableProperties>(
        regularPatchFormDecode,
        toRegularPatchablePropertiesEncode,
        toRegularPatchablePropertiesDecode
      ),
      fold((errors: Errors): never => {
        throw new DecodeError('Error in domain gateway', { cause: errors });
      }, this._patchRegularAction$)
    );

  public onPatchRegularActionSuccess = (regular: PatchRegular): void => {
    this.patchRegularForm.reset();
    this._toaster.toast(toPatchRegularSuccessToast(regular));
    this.regularUpdated.emit(toRegularValues(regular.regularPatched));
  };

  public onPatchRegularActionError = (error: Error): void => {
    this._toaster.toast({
      content: `Échec de l'ajout du téléphone: ${error.name} | ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };

  public onSubmit = (triggerAction: () => void): void => {
    this.patchRegularForm.markAllAsTouched();
    triggerAction();
  };

  public getPhoneControl = (): FormGroup<PhoneFields> => this.patchRegularForm.get('phone') as FormGroup<PhoneFields>;

  public getWaypointControl = (): FormGroup<WaypointFields> =>
    this.patchRegularForm.get('waypoint') as FormGroup<WaypointFields>;
}
