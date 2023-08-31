import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Entity, Place, Subcontractor } from '@domain';
import { EstimateJourneyValues } from '../../components';

export type FareToSubcontractPresentation = Entity &
  EstimateJourneyValues &
  Subcontractor & {
    passenger: string;
    phoneToCall: string;
    departureDatetime: string;
    departurePlace: Place;
    arrivalPlace: Place;
    isTwoWayDrive: boolean;
    isMedicalDrive: boolean;
  };

export type FareToSubcontractValues = Subcontractor;

export type SubcontractFareFields = {
  subcontractor: FormControl<string>;
};

export const SUBCONTRACT_FARE_FORM: FormGroup<Record<keyof FareToSubcontractValues, FormControl>> = new FormGroup<
  Record<keyof FareToSubcontractValues, FormControl>
>({
  subcontractor: new FormControl<FareToSubcontractValues['subcontractor']>('', [Validators.required])
});

export const setSubcontractFareErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? SUBCONTRACT_FARE_FORM.setErrors(handledError.errors)
    : SUBCONTRACT_FARE_FORM.get(handledError.field)?.setErrors(handledError.errors);
