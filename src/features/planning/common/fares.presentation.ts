import { PlanningSession } from '../components/planning/planning-row/planning-row.component';
import { Driver, Entity, Scheduled } from '@definitions';
import { boolean as ioBoolean, number as ioNumber, string as ioString, type as ioType, Type } from 'io-ts';
import { EstimateJourneyFields, estimateJourneyFormControls, EstimateJourneyValues } from '../components';
import { FormControl, Validators } from '@angular/forms';
import { PhoneField, phoneFieldFormControl, PhoneValues, phoneValuesCodec } from '@features/common/phone';
import { PlaceField, placeFieldFormControl } from '../../common/place/components/place-field/place-field.form';
import { placeValuesCodec } from '../../common/place/codecs';
import { PlaceValues } from '@features/common/place';
import {
  DestinationField,
  destinationFieldFormControl,
  DestinationValues,
  destinationValuesCodec
} from '@features/common/destination';
import { DriverField, driverFieldFormControl } from '../../common/driver/components/driver-field/driver-field.form';
import { DriverValues, driverValuesCodec } from '@features/common/driver';
import { RegularField, regularFieldFormControl } from '../../common/regular/components/regular-field/regular-field.form';
import { RegularValues, regularValuesEntityCodec } from '@features/common/regular';

export type DailyDriverPlanning = {
  driver: Driver & Entity;
  fares: ScheduledPlanningSession[];
};

// Plannings, horizontal axis
export type ScheduledPresentation = Entity & Scheduled & { localTime: string };
export type ScheduledPlanningSession = PlanningSession & ScheduledPresentation;

export type FareValues = EstimateJourneyValues & {
  passenger: Entity & RegularValues;
  phoneToCall: PhoneValues;
  departureDatetime: string;
  departurePlace: PlaceValues;
  arrivalPlace: DestinationValues;
  driver: DriverValues;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
};

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

export type FareFields = DestinationField<'arrivalPlace'> &
  DriverField<'driver'> &
  EstimateJourneyFields &
  PhoneField<'phoneToCall'> &
  PlaceField<'departurePlace'> &
  RegularField<'passenger'> & {
    departureDatetime: FormControl<FareValues['departureDatetime']>;
    isTwoWayDrive: FormControl<FareValues['isTwoWayDrive']>;
    isMedicalDrive: FormControl<FareValues['isMedicalDrive']>;
  };

// eslint-disable-next-line max-lines-per-function
export const fareFormControls = (): FareFields => ({
  ...regularFieldFormControl('passenger'),
  ...phoneFieldFormControl('phoneToCall'),
  departureDatetime: new FormControl<FareValues['departureDatetime']>('', {
    nonNullable: true,
    validators: [Validators.required]
  }),
  ...driverFieldFormControl('driver'),
  ...placeFieldFormControl('departurePlace'),
  ...destinationFieldFormControl('arrivalPlace'),
  ...estimateJourneyFormControls(),
  isTwoWayDrive: new FormControl<FareValues['isTwoWayDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  isMedicalDrive: new FormControl<FareValues['isMedicalDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  })
});
