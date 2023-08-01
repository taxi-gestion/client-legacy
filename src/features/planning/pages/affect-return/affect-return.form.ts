import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Place } from '@features/common/place';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { ReturnToAffect } from '../../providers';

export type AffectReturnFields = {
  fareId: FormControl<string>;
  driveFrom: FormControl<Place>;
  planning: FormControl<string>;
  driveTo: FormControl<Place>;
  startTime: FormControl<string>;
};

export const AFFECT_RETURN_FORM: FormGroup<Record<keyof ReturnToAffect, FormControl>> = new FormGroup<
  Record<keyof ReturnToAffect, FormControl>
>({
  fareId: new FormControl<ReturnToAffect['fareId']>(''),
  driveFrom: new FormControl<ReturnToAffect['driveFrom']>(defaultPlaceValue, [Validators.required]),
  planning: new FormControl<ReturnToAffect['planning']>('', [Validators.required]),
  driveTo: new FormControl<ReturnToAffect['driveTo']>(defaultPlaceValue, [Validators.required]),
  startTime: new FormControl<ReturnToAffect['startTime']>('12:00', [Validators.required])
});

export const setAffectReturnErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? AFFECT_RETURN_FORM.setErrors(handledError.errors)
    : AFFECT_RETURN_FORM.get(handledError.field)?.setErrors(handledError.errors);
