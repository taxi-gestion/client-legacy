import { FormGroup } from '@angular/forms';
import {
  boolean as ioBoolean,
  intersection as ioIntersection,
  number as ioNumber,
  string as ioString,
  Type,
  type as ioType
} from 'io-ts';
import {
  FareFields,
  fareFormControls,
  ScheduledToEditValues,
  FareToScheduleValues,
  FareValues,
  ReturnToScheduleValues,
  UnassignedToAllocateValues
} from '../presentation/fares.presentation';
import { entityCodec } from '@codecs';
import {
  VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME,
  VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME
} from '@features/common/form-validation';
import { regularValuesEntityCodec } from '@features/regular';
import { phoneValuesCodec } from '@features/common/phone';
import { driverValuesCodec } from '@features/common/driver';
import { waypointValuesCodec } from '@features/common/waypoint';
import { Entity } from '@definitions';

export type ScheduleFareFields = FareFields;
export type EditScheduledFields = FareFields;
export type SchedulePendingFields = FareFields;

export const pendingFormCodec: Type<ReturnToScheduleValues> = ioType({
  id: ioString,
  departureDatetime: ioString,
  departurePlace: waypointValuesCodec,
  driveDuration: ioNumber,
  driveDistance: ioNumber,
  arrivalPlace: waypointValuesCodec,
  driver: driverValuesCodec
});

export const fareFormCodec: Type<FareValues> = ioType({
  passenger: regularValuesEntityCodec,
  phoneToCall: phoneValuesCodec,
  departureDatetime: ioString,
  departurePlace: waypointValuesCodec,
  driveDuration: ioNumber,
  driveDistance: ioNumber,
  arrivalPlace: waypointValuesCodec,
  driver: driverValuesCodec,
  isTwoWayDrive: ioBoolean,
  isMedicalDrive: ioBoolean
});

export const unassignedToAllocateFormCodec: Type<UnassignedToAllocateValues> = ioType({
  passenger: regularValuesEntityCodec,
  phoneToCall: phoneValuesCodec,
  departureDatetime: ioString,
  departurePlace: waypointValuesCodec,
  driveDuration: ioNumber,
  driveDistance: ioNumber,
  arrivalPlace: waypointValuesCodec,
  isTwoWayDrive: ioBoolean,
  isMedicalDrive: ioBoolean
});

export const scheduleFareFormCodec: Type<FareToScheduleValues> = fareFormCodec;

export const unassignedToSchedule: Type<Entity & FareToScheduleValues> = ioIntersection([entityCodec, scheduleFareFormCodec]);

export const editScheduledFormCodec: Type<ScheduledToEditValues> = ioIntersection([entityCodec, fareFormCodec]);

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
