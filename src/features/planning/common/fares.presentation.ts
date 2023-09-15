import { PlanningSession } from '../components/planning/planning-row/planning-row.component';
import { Driver, Entity, Place, RegularDetails, Scheduled } from '@definitions';
import { boolean as ioBoolean, number as ioNumber, string as ioString, type as ioType, Type, union as ioUnion } from 'io-ts';
import { placeCodec, regularDetailsEntityCodec } from '@codecs';
import { DestinationValues, EstimateJourneyFields, estimateJourneyFormControls, EstimateJourneyValues } from '../components';
import { FormControl, Validators } from '@angular/forms';
import { defaultPlaceValue } from './fares.presenter';
import { driverEntityCodec } from '../../../codecs/domain/driver.codecs';
import { defaultDriverValue } from './driver.presenter';
import { placeValidator } from '../validators/place.validator';
import { notEmptyDriverValidator } from '../validators/driver.validator';
import { phoneNumberValidator } from '../components/regular/phones/phones.validator';

export type DailyDriverPlanning = {
  driver: Driver & Entity;
  fares: ScheduledPlanningSession[];
};

// Plannings, horizontal axis
export type ScheduledPresentation = Entity & Scheduled & { localTime: string };
export type ScheduledPlanningSession = PlanningSession & ScheduledPresentation;

export type FareValues = EstimateJourneyValues & {
  passenger: string | (Entity & RegularDetails);
  phoneToCall: string;
  departureDatetime: string;
  departurePlace: Place;
  arrivalPlace: Place;
  driver: Driver & Entity;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
};

export const fareFormCodec: Type<FareValues> = ioType({
  passenger: ioUnion([ioString, regularDetailsEntityCodec]),
  phoneToCall: ioString,
  departureDatetime: ioString,
  departurePlace: placeCodec,
  driveDuration: ioNumber,
  driveDistance: ioNumber,
  arrivalPlace: placeCodec,
  driver: driverEntityCodec,
  isTwoWayDrive: ioBoolean,
  isMedicalDrive: ioBoolean
});

export type FareFields = EstimateJourneyFields & {
  passenger: FormControl<FareValues['passenger']>;
  phoneToCall: FormControl<FareValues['phoneToCall']>;
  departureDatetime: FormControl<FareValues['departureDatetime']>;
  departurePlace: FormControl<FareValues['departurePlace']>;
  arrivalPlace: FormControl<FareValues['arrivalPlace']>;
  driver: FormControl<FareValues['driver']>;
  isTwoWayDrive: FormControl<FareValues['isTwoWayDrive']>;
  isMedicalDrive: FormControl<FareValues['isMedicalDrive']>;
};

// eslint-disable-next-line max-lines-per-function
export const fareFormControls = (): FareFields => ({
  passenger: new FormControl<FareValues['passenger']>('', {
    nonNullable: true,
    validators: [Validators.required]
  }),
  phoneToCall: new FormControl<FareValues['phoneToCall']>('', {
    nonNullable: true,
    validators: [Validators.required, phoneNumberValidator]
  }),
  departureDatetime: new FormControl<FareValues['departureDatetime']>('', {
    nonNullable: true,
    validators: [Validators.required]
  }),
  driver: new FormControl<FareValues['driver']>(defaultDriverValue, {
    nonNullable: true,
    validators: [Validators.required, notEmptyDriverValidator]
  }),
  departurePlace: new FormControl<FareValues['departurePlace']>(defaultPlaceValue, {
    nonNullable: true,
    validators: [Validators.required, placeValidator]
  }),
  arrivalPlace: new FormControl<FareValues['arrivalPlace']>(defaultPlaceValue, {
    nonNullable: true,
    validators: [Validators.required, placeValidator]
  }),
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
