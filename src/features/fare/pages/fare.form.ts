import { FormGroup } from '@angular/forms';
import {
  boolean as ioBoolean,
  intersection as ioIntersection,
  string as ioString,
  type as ioType,
  Type,
  number as ioNumber
} from 'io-ts';
import { FareFields, fareFormControls, FareValues } from '../presentation/fares.presentation';
import { Entity } from '@definitions';
import { entityCodec } from '@codecs';
import {
  VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME,
  VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME
} from '@features/common/form-validation';
import { regularValuesEntityCodec } from '@features/common/regular';
import { phoneValuesCodec } from '@features/common/phone';
import { placeValuesCodec } from '@features/common/place';
import { destinationValuesCodec } from '@features/common/destination';
import { driverValuesCodec } from '@features/common/driver';

export type FareToScheduleValues = FareValues;
export type FareToEditValues = Entity & FareValues;

export type ScheduleFareFields = FareFields;
export type EditFareFields = FareFields;

export const fareFormCodec: Type<FareValues> = ioType({
  passenger: regularValuesEntityCodec,
  phoneToCall: phoneValuesCodec,
  departureDatetime: ioString,
  departurePlace: placeValuesCodec,
  driveDuration: ioNumber,
  driveDistance: ioNumber,
  arrivalPlace: destinationValuesCodec,
  driver: driverValuesCodec,
  isTwoWayDrive: ioBoolean,
  isMedicalDrive: ioBoolean
});

export const scheduleFareFormCodec: Type<FareToScheduleValues> = fareFormCodec;
export const editFareFormCodec: Type<FareToEditValues> = ioIntersection([entityCodec, fareFormCodec]);

export const FARE_FORM: FormGroup<FareFields> = new FormGroup<FareFields>({
  ...fareFormControls()
});

export const setFareErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? FARE_FORM.setErrors(handledError.errors)
    : FARE_FORM.get(handledError.field)?.setErrors(handledError.errors);

export type FormattedFareError = { field?: string; errors: Record<string, unknown> };
export const formatFareError = (error: Error): FormattedFareError =>
  fareErrorFormatMap.get(error.name)?.(error) ?? {
    errors: { unknown: true }
  };

const fareErrorFormatMap: Map<string, (error: Error) => FormattedFareError> = new Map([
  [
    VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME,
    (error: Error): FormattedFareError => ({
      errors: {
        [VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME]: error
      }
    })
  ],
  [
    VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME,
    (error: Error): FormattedFareError => ({
      errors: {
        [VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME]: error
      }
    })
  ]
]);
