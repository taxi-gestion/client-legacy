import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FareToAddToPlanning } from '../../providers/actions/add-fare-to-planning.action.provider';

export const ADD_FARE_TO_PLANNING_FORM: FormGroup<Record<keyof FareToAddToPlanning, FormControl>> = new FormGroup<
  Record<keyof FareToAddToPlanning, FormControl>
>({
  clientIdentity: new FormControl<FareToAddToPlanning['clientIdentity']>('Bob', [Validators.required]),
  clientPhone: new FormControl<FareToAddToPlanning['clientPhone']>('+33684319514', [Validators.required]),
  date: new FormControl<FareToAddToPlanning['date']>(new Date(), [Validators.required]),
  driveFrom: new FormControl<FareToAddToPlanning['driveFrom']>('18 Avenue des Canuts, 69120', [Validators.required]),
  driveKind: new FormControl<FareToAddToPlanning['driveKind']>('outward', [Validators.required]),
  driveNature: new FormControl<FareToAddToPlanning['driveNature']>('medical', [Validators.required]),
  driverIdentity: new FormControl<FareToAddToPlanning['driverIdentity']>('David Huan'),
  driveTo: new FormControl<FareToAddToPlanning['driveTo']>('17 Avenue du général de Gaule 69001', [Validators.required]),
  startTime: new FormControl<FareToAddToPlanning['startTime']>('16:00', [Validators.required])
});

export const setAddFareToPlanningErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? ADD_FARE_TO_PLANNING_FORM.setErrors(handledError.errors)
    : ADD_FARE_TO_PLANNING_FORM.get(handledError.field)?.setErrors(handledError.errors);
