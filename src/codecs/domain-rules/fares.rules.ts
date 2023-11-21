/* eslint-disable @typescript-eslint/typedef */
import { keyof as ioKeyOf, literal as ioLiteral, type as ioType, undefined as ioUndefined, union as ioUnion } from 'io-ts';
import { isDateISO8601String, isPositive, isRRULEString, isTimeISO8601String } from '../rules';
import { driverEntityRules } from './driver.rules';
import { waypointRules } from './waypoint.rules';
import { kindCodec, natureCodec } from '../domain';
import { passengerEntityRules } from './passenger.rules';

export const toRecurringRules = ioType(
  {
    departureTime: isTimeISO8601String,
    returnTime: ioUnion([isTimeISO8601String, ioUndefined]),
    duration: isPositive,
    distance: isPositive,
    departure: waypointRules,
    arrival: waypointRules,
    driver: ioUnion([driverEntityRules, ioUndefined]),
    passenger: passengerEntityRules,
    kind: kindCodec,
    status: ioLiteral('to-recurring'),
    nature: natureCodec,
    recurrence: isRRULEString
  },
  'toRecurringRules'
);

export const toScheduledRules = ioType(
  {
    datetime: isDateISO8601String,
    duration: isPositive,
    distance: isPositive,
    departure: waypointRules,
    arrival: waypointRules,
    driver: driverEntityRules,
    passenger: passengerEntityRules,
    kind: kindCodec,
    status: ioLiteral('to-scheduled'),
    nature: natureCodec,
    creator: ioKeyOf({ manager: null, recurrence: null })
  },
  'toScheduledRules'
);

export const toScheduledEditedRules = ioType(
  {
    datetime: isDateISO8601String,
    duration: isPositive,
    distance: isPositive,
    departure: waypointRules,
    arrival: waypointRules,
    driver: driverEntityRules,
    passenger: passengerEntityRules,
    kind: kindCodec,
    status: ioLiteral('to-scheduled-edited'),
    nature: natureCodec,
    creator: ioKeyOf({ manager: null, recurrence: null })
  },
  'toScheduledEditedRules'
);

export const returnDriveRules = ioType(
  {
    datetime: isDateISO8601String,
    duration: isPositive,
    distance: isPositive,
    departure: waypointRules,
    arrival: waypointRules,
    driver: driverEntityRules,
    status: ioLiteral('pending-to-scheduled'),
    creator: ioKeyOf({ manager: null, recurrence: null })
  },
  'returnDriveRules'
);

export const toUnassignedRules = ioType(
  {
    datetime: isDateISO8601String,
    duration: isPositive,
    distance: isPositive,
    departure: waypointRules,
    arrival: waypointRules,
    passenger: passengerEntityRules,
    kind: kindCodec,
    status: ioLiteral('to-unassigned'),
    nature: natureCodec,
    creator: ioKeyOf({ manager: null, recurrence: null })
  },
  'toUnassignedRules'
);
