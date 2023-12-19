import { Entity } from '@definitions';
import { FormControl, Validators } from '@angular/forms';
import { PhoneField, phoneFieldFormControl, PhoneValues } from '@features/common/phone';
import {
  DriverField,
  driverFieldFormControl,
  optionalDriverFieldFormControl
} from '../../common/driver/components/driver-field/driver-field.form';
import { DriverValues } from '@features/common/driver';
import { RegularField, regularFieldFormControl, RegularValues } from '@features/regular';
import { EstimateJourneyFields, estimateJourneyFieldsFormControl } from '@features/common/journey';
import { WaypointField, waypointFieldFormControl, WaypointValues } from '@features/common/waypoint';
import { codecControlValidator, timeValidator } from '@features/common/form-validation';
import { isTimeISO8601String, TimeISO8601 } from '../../../codecs/rules/timeISO8601.rule';
import { null as ioNull, undefined as ioUndefined, union as ioUnion } from 'io-ts';

export type FareValues = {
  passenger: Entity & RegularValues;
  phoneToCall: PhoneValues;
  departureDatetime: string;
  departurePlace: WaypointValues;
  arrivalPlace: WaypointValues;
  driveDuration: number;
  driveDistance: number;
  driver: DriverValues;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
};

export type FareToScheduleValues = FareValues;
export type ScheduledToEditValues = Entity & FareValues;
export type UnassignedToScheduleValues = Entity & FareValues;
export type ReturnToScheduleValues = Entity & {
  id: string;
  departureDatetime: string;
  departurePlace: WaypointValues;
  arrivalPlace: WaypointValues;
  driveDuration: number;
  driveDistance: number;
  driver: DriverValues;
};
export type RecurringToAddValues = Omit<FareValues, 'departureDatetime' | 'driver'> & {
  driver: DriverValues | undefined;
  departureTime: string;
  returnTime: string | undefined;
  recurrenceRule: string;
};

export type UnassignedToAllocateValues = Omit<FareValues, 'driver'>;

export type FareFields = DriverField<'driver'> &
  EstimateJourneyFields<'driveDuration', 'driveDistance'> &
  PhoneField<'phoneToCall'> &
  RegularField<'passenger'> &
  WaypointField<'arrivalPlace'> &
  WaypointField<'departurePlace'> & {
    departureDatetime: FormControl<FareValues['departureDatetime']>;
    isTwoWayDrive: FormControl<FareValues['isTwoWayDrive']>;
    isMedicalDrive: FormControl<FareValues['isMedicalDrive']>;
  };

export type ScheduleScheduledFields = FareFields;
export type EditScheduledFields = FareFields;
export type SchedulePendingFields = FareFields;
export type AddRecurringFields = DriverField<'driver'> &
  EstimateJourneyFields<'driveDuration', 'driveDistance'> &
  PhoneField<'phoneToCall'> &
  WaypointField<'arrivalPlace'> &
  WaypointField<'departurePlace'> & {
    departureTime: FormControl<RecurringToAddValues['departureTime']>;
    returnTime: FormControl<RecurringToAddValues['returnTime']>;
    isTwoWayDrive: FormControl<RecurringToAddValues['isTwoWayDrive']>;
    isMedicalDrive: FormControl<RecurringToAddValues['isMedicalDrive']>;
    recurrenceRule: FormControl<string>;
  };

// eslint-disable-next-line max-lines-per-function
export const fareFormControls = (): FareFields => ({
  ...regularFieldFormControl('passenger'),
  ...phoneFieldFormControl('phoneToCall'),
  departureDatetime: new FormControl<FareValues['departureDatetime']>('', {
    nonNullable: true,
    validators: [Validators.required]
  }),
  ...estimateJourneyFieldsFormControl('driveDuration', 'driveDistance'),
  ...driverFieldFormControl('driver'),
  ...waypointFieldFormControl('departurePlace'),
  ...waypointFieldFormControl('arrivalPlace'),
  isTwoWayDrive: new FormControl<FareValues['isTwoWayDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  isMedicalDrive: new FormControl<FareValues['isMedicalDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  })
});

// eslint-disable-next-line max-lines-per-function
export const recurringFareFormControls = (): AddRecurringFields => ({
  ...regularFieldFormControl('passenger'),
  ...phoneFieldFormControl('phoneToCall'),
  departureTime: new FormControl<RecurringToAddValues['departureTime']>('' as TimeISO8601, {
    nonNullable: true,
    validators: [timeValidator]
  }),
  returnTime: new FormControl<RecurringToAddValues['returnTime']>(undefined, {
    nonNullable: true,
    validators: [codecControlValidator(ioUnion([isTimeISO8601String, ioUndefined, ioNull]), 'invalidTime')]
  }),
  ...estimateJourneyFieldsFormControl('driveDuration', 'driveDistance'),
  ...optionalDriverFieldFormControl('driver'),
  ...waypointFieldFormControl('departurePlace'),
  ...waypointFieldFormControl('arrivalPlace'),
  isTwoWayDrive: new FormControl<RecurringToAddValues['isTwoWayDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  isMedicalDrive: new FormControl<RecurringToAddValues['isMedicalDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  recurrenceRule: new FormControl<RecurringToAddValues['recurrenceRule']>('', {
    nonNullable: true,
    validators: [Validators.required]
  })
});
