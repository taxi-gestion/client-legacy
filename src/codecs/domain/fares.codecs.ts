/* eslint-disable max-lines */
import type { Type } from 'io-ts';
import {
  intersection as ioIntersection,
  keyof as ioKeyOf,
  literal as ioLiteral,
  string as ioString,
  type as ioType
} from 'io-ts';
import {
  Entity,
  Pending,
  PendingToScheduled,
  Scheduled,
  Subcontracted,
  Subcontractor,
  ToScheduledEdited,
  ToScheduled,
  ToSubcontracted,
  Unassigned,
  ToUnassigned
} from '../../definitions';
import { driveCodec, durationDistanceCodec, entityCodec, passengerEntityCodec } from './traits.codecs';
import { driverEntityCodec } from './driver.codecs';

export const toScheduleCodec: Type<ToScheduled> = ioIntersection(
  [
    driveCodec,
    durationDistanceCodec,
    ioType({
      driver: driverEntityCodec,
      passenger: passengerEntityCodec,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      kind: ioKeyOf({ 'one-way': null, 'two-way': null }),
      status: ioLiteral('to-scheduled'),
      nature: ioKeyOf({ medical: null, standard: null })
    })
  ],
  'toScheduleCodec'
);

export const toUnassignedCodec: Type<ToUnassigned> = ioIntersection(
  [
    driveCodec,
    durationDistanceCodec,
    ioType({
      passenger: passengerEntityCodec,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      kind: ioKeyOf({ 'one-way': null, 'two-way': null }),
      status: ioLiteral('to-unassigned'),
      nature: ioKeyOf({ medical: null, standard: null })
    })
  ],
  'toUnassignedCodec'
);

export const unassignedToScheduleCodec: Type<Entity & ToScheduled> = ioIntersection(
  [
    entityCodec,
    driveCodec,
    durationDistanceCodec,
    ioType({
      driver: driverEntityCodec,
      passenger: passengerEntityCodec,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      kind: ioKeyOf({ 'one-way': null, 'two-way': null }),
      status: ioLiteral('to-scheduled'),
      nature: ioKeyOf({ medical: null, standard: null })
    })
  ],
  'toScheduleCodec'
);

export const returnDriveCodec: Type<PendingToScheduled> = ioIntersection(
  [
    driveCodec,
    durationDistanceCodec,
    ioType({
      driver: driverEntityCodec,
      status: ioLiteral('pending-to-scheduled')
    })
  ],
  'returnDriveCodec'
);

export const toEditCodec: Type<ToScheduledEdited> = ioIntersection(
  [
    driveCodec,
    durationDistanceCodec,
    ioType({
      driver: driverEntityCodec,
      passenger: passengerEntityCodec,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      kind: ioKeyOf({ 'one-way': null, 'two-way': null }),
      status: ioLiteral('to-scheduled-edited'),
      nature: ioKeyOf({ medical: null, standard: null })
    })
  ],
  'toEditCodec'
);

export const scheduledToEditCodec: Type<Entity & ToScheduledEdited> = ioIntersection(
  [entityCodec, toEditCodec],
  'scheduledToEditCodec'
);

export const pendingReturnCodec: Type<Entity & Pending> = ioIntersection(
  [
    entityCodec,
    driveCodec,
    ioType({
      passenger: passengerEntityCodec,
      driver: driverEntityCodec,
      kind: ioLiteral('two-way'),
      status: ioLiteral('pending'),
      nature: ioKeyOf({ medical: null, standard: null })
    })
  ],
  'pendingReturnCodec'
);

export const scheduledFareCodec: Type<Entity & Scheduled> = ioIntersection(
  [
    entityCodec,
    driveCodec,
    durationDistanceCodec,
    ioType({
      driver: driverEntityCodec,
      passenger: passengerEntityCodec,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      kind: ioKeyOf({ 'one-way': null, 'two-way': null }),
      status: ioLiteral('scheduled'),
      nature: ioKeyOf({ medical: null, standard: null })
    })
  ],
  'scheduledFareCodec'
);

export const unassignedFareCodec: Type<Entity & Unassigned> = ioIntersection(
  [
    entityCodec,
    driveCodec,
    durationDistanceCodec,
    ioType({
      passenger: passengerEntityCodec,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      kind: ioKeyOf({ 'one-way': null, 'two-way': null }),
      status: ioLiteral('unassigned'),
      nature: ioKeyOf({ medical: null, standard: null })
    })
  ],
  'unassignedFareCodec'
);

export const subcontractorCodec: Type<Subcontractor> = ioType({
  identity: ioString
});

export const fareToSubcontractCodec: Type<Entity & ToSubcontracted> = ioIntersection(
  [
    entityCodec,
    ioType({
      subcontractor: subcontractorCodec,
      status: ioLiteral('to-subcontracted')
    })
  ],
  'fareToSubcontractCodec'
);

export const subcontractedFareCodec: Type<Entity & Subcontracted> = ioIntersection(
  [
    entityCodec,
    driveCodec,
    durationDistanceCodec,
    ioType({
      passenger: passengerEntityCodec,
      subcontractor: subcontractorCodec,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      kind: ioKeyOf({ 'one-way': null, 'two-way': null }),
      status: ioLiteral('subcontracted'),
      nature: ioKeyOf({ medical: null, standard: null })
    })
  ],
  'subcontractedFareCodec'
);

export const toSubcontractCodec: Type<ToSubcontracted> = ioType(
  {
    subcontractor: subcontractorCodec,
    status: ioLiteral('to-subcontracted')
  },
  'toSubcontractCodec'
);
