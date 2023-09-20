import { PlanningSession } from '../components/planning/planning-row/planning-row.component';
import { Driver, Entity, RegularDetails, Scheduled } from '@definitions';
import {
  boolean as ioBoolean,
  intersection as ioIntersection,
  number as ioNumber,
  string as ioString,
  type as ioType,
  Type,
  undefined as ioUndefined,
  union as ioUnion
} from 'io-ts';
import { civilityCodec, entityCodec } from '@codecs';
import { EstimateJourneyFields, estimateJourneyFormControls, EstimateJourneyValues } from '../components';
import { FormControl, Validators } from '@angular/forms';
import { defaultPassengerValue } from './regular.presenter';
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

export type DailyDriverPlanning = {
  driver: Driver & Entity;
  fares: ScheduledPlanningSession[];
};

// Plannings, horizontal axis
export type ScheduledPresentation = Entity & Scheduled & { localTime: string };
export type ScheduledPlanningSession = PlanningSession & ScheduledPresentation;

export type FareValues = EstimateJourneyValues & {
  // TODO Replace with Values type
  passenger: Entity & Pick<RegularDetails, 'civility' | 'firstname' | 'lastname'>;
  phoneToCall: PhoneValues;
  departureDatetime: string;
  departurePlace: PlaceValues;
  arrivalPlace: DestinationValues;
  driver: DriverValues;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
};

export const fareFormCodec: Type<FareValues> = ioType({
  passenger: ioIntersection([
    entityCodec,
    ioType({
      civility: civilityCodec,
      firstname: ioUnion([ioString, ioUndefined]),
      lastname: ioString
    })
  ]),
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
  PlaceField<'departurePlace'> & {
    passenger: FormControl<FareValues['passenger']>;
    departureDatetime: FormControl<FareValues['departureDatetime']>;
    //arrivalPlace: FormControl<FareValues['arrivalPlace']>;
    isTwoWayDrive: FormControl<FareValues['isTwoWayDrive']>;
    isMedicalDrive: FormControl<FareValues['isMedicalDrive']>;
  };

// eslint-disable-next-line max-lines-per-function
export const fareFormControls = (): FareFields => ({
  passenger: new FormControl<FareValues['passenger']>(defaultPassengerValue, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  ...phoneFieldFormControl('phoneToCall'),
  departureDatetime: new FormControl<FareValues['departureDatetime']>('', {
    nonNullable: true,
    validators: [Validators.required]
  }),
  ...driverFieldFormControl('driver'),
  ...placeFieldFormControl('departurePlace'),
  ...destinationFieldFormControl('arrivalPlace'),
  ...estimateJourneyFormControls(),
  isTwoWayDrive: new FormControl<DestinationValues['isTwoWayDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  isMedicalDrive: new FormControl<DestinationValues['isMedicalDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  })
});
