import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Entity } from '@definitions';
import {
  boolean as ioBoolean,
  intersection as ioIntersection,
  number as ioNumber,
  string as ioString,
  type as ioType,
  Type
} from 'io-ts';
import { entityCodec } from '@codecs';
import { DriverField, driverFieldFormControl } from '../../../common/driver/components/driver-field/driver-field.form';
import { EstimateJourneyFields, estimateJourneyFormControls, EstimateJourneyValues } from '../../components';
import { PhoneField, phoneFieldFormControl, PhoneValues, phoneValuesCodec } from '@features/common/phone';
import { PlaceField, placeFieldFormControl, PlaceValues, placeValuesCodec } from '@features/common/place';
import { RegularField, regularFieldFormControl } from '../../../common/regular/components/regular-field/regular-field.form';
import { RegularValues, regularValuesEntityCodec } from '@features/common/regular';
import { DriverValues, driverValuesCodec } from '@features/common/driver';

export type PendingToScheduleValues = EstimateJourneyValues & {
  passenger: Entity & RegularValues;
  phoneToCall: PhoneValues;
  departureDatetime: string;
  departurePlace: PlaceValues;
  arrivalPlace: PlaceValues;
  driver: DriverValues;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
};

export type SchedulePendingFields = DriverField<'driver'> &
  EstimateJourneyFields &
  PhoneField<'phoneToCall'> &
  PlaceField<'arrivalPlace'> &
  PlaceField<'departurePlace'> &
  RegularField<'passenger'> & {
    departureDatetime: FormControl<PendingToScheduleValues['departureDatetime']>;
    isTwoWayDrive: FormControl<PendingToScheduleValues['isTwoWayDrive']>;
    isMedicalDrive: FormControl<PendingToScheduleValues['isMedicalDrive']>;
  };

const scheduleReturnFormCodec: Type<PendingToScheduleValues> = ioType({
  passenger: regularValuesEntityCodec,
  phoneToCall: phoneValuesCodec,
  departureDatetime: ioString,
  departurePlace: placeValuesCodec,
  arrivalPlace: placeValuesCodec,
  driveDuration: ioNumber,
  driveDistance: ioNumber,
  driver: driverValuesCodec,
  isTwoWayDrive: ioBoolean,
  isMedicalDrive: ioBoolean
});

export const schedulePendingFormCodec: Type<Entity & PendingToScheduleValues> = ioIntersection([
  entityCodec,
  scheduleReturnFormCodec
]);

export const SCHEDULE_PENDING_FORM: FormGroup<SchedulePendingFields> = new FormGroup<SchedulePendingFields>({
  ...regularFieldFormControl('passenger'),
  ...phoneFieldFormControl('phoneToCall'),
  departureDatetime: new FormControl<PendingToScheduleValues['departureDatetime']>('', {
    nonNullable: true,
    validators: [Validators.required]
  }),
  ...driverFieldFormControl('driver'),
  ...placeFieldFormControl('departurePlace'),
  ...placeFieldFormControl('arrivalPlace'),
  ...estimateJourneyFormControls(),
  isTwoWayDrive: new FormControl<PendingToScheduleValues['isTwoWayDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  isMedicalDrive: new FormControl<PendingToScheduleValues['isMedicalDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  })
});

export const setSchedulePendingErrorToForm = (handledError: { field?: string; errors: Record<string, unknown> }): void =>
  handledError.field == null
    ? SCHEDULE_PENDING_FORM.setErrors(handledError.errors)
    : SCHEDULE_PENDING_FORM.get(handledError.field)?.setErrors(handledError.errors);
