import type { Type } from 'io-ts';
import {
  intersection as ioIntersection,
  keyof as ioKeyof,
  literal as ioLiteral,
  number as ioNumber,
  string as ioString,
  type as ioType,
  array as ioArray,
  tuple as ioTuple,
  union as ioUnion,
  undefined as ioUndefined
} from 'io-ts';
import {
  Drive,
  DurationDistance,
  Entity,
  FareToEdit,
  FareToSchedule,
  Passenger,
  Pending,
  Regular,
  ReturnToSchedule,
  Scheduled
} from '@domain';

import { placeCodec } from './common';

const entityCodec: Type<Entity> = ioType({
  id: ioString
});

const driveCodec: Type<Drive> = ioType({
  datetime: ioString,
  departure: placeCodec,
  destination: placeCodec,
  driver: ioString
});

const durationDistanceCodec: Type<DurationDistance> = ioType({
  duration: ioNumber,
  distance: ioNumber
});

const passengerCodec: Type<Passenger> = ioType({
  passenger: ioString,
  phone: ioString
});

export const regularPassengerCodec: Type<Regular> = ioType({
  firstname: ioString,
  lastname: ioString,
  phone: ioString
});

export const fareToScheduleCodec: Type<FareToSchedule> = ioIntersection([
  driveCodec,
  durationDistanceCodec,
  passengerCodec,
  ioType({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    kind: ioKeyof({ 'one-way': null, 'two-way': null }),
    status: ioLiteral('to-schedule'),
    nature: ioKeyof({ medical: null, standard: null })
  })
]);

export const returnToScheduleCodec: Type<Entity & ReturnToSchedule> = ioIntersection([
  entityCodec,
  driveCodec,
  durationDistanceCodec,
  ioType({
    kind: ioLiteral('two-way'),
    status: ioLiteral('return-to-schedule')
  })
]);

export const fareToEditCodec: Type<Entity & FareToEdit> = ioIntersection([
  entityCodec,
  driveCodec,
  durationDistanceCodec,
  passengerCodec,
  ioType({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    kind: ioKeyof({ 'one-way': null, 'two-way': null }),
    status: ioLiteral('to-edit'),
    nature: ioKeyof({ medical: null, standard: null })
  })
]);

const pendingReturnCodec: Type<Entity & Pending> = ioIntersection([
  entityCodec,
  passengerCodec,
  driveCodec,
  ioType({
    kind: ioLiteral('two-way'),
    status: ioLiteral('pending-return'),
    nature: ioKeyof({ medical: null, standard: null })
  })
]);

export const pendingReturnsCodec: Type<(Entity & Pending)[]> = ioArray(pendingReturnCodec);

const scheduledFareCodec: Type<Entity & Scheduled> = ioIntersection([
  entityCodec,
  passengerCodec,
  driveCodec,
  durationDistanceCodec,
  ioType({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    kind: ioKeyof({ 'one-way': null, 'two-way': null }),
    status: ioLiteral('scheduled'),
    nature: ioKeyof({ medical: null, standard: null })
  })
]);

export const scheduledFaresCodec: Type<(Entity & Scheduled)[]> = ioArray(scheduledFareCodec);

export const scheduledFareAndOptionalPendingReturnCodec: Type<[Entity & Scheduled, (Entity & Pending)?]> = ioTuple([
  scheduledFareCodec,
  ioUnion([pendingReturnCodec, ioUndefined])
]) as unknown as Type<[Entity & Scheduled, (Entity & Pending)?]>;
