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
  ReturnDrive,
  Scheduled,
  Subcontracted,
  Subcontractor,
  ToEdit,
  ToSchedule,
  ToSubcontract
} from '../../definitions';
import { driveCodec, durationDistanceCodec, entityCodec, passengerEntityCodec } from './traits.codecs';
import { driverEntityCodec } from './driver.codecs';

export const toScheduleCodec: Type<ToSchedule> = ioIntersection(
  [
    driveCodec,
    durationDistanceCodec,
    ioType({
      driver: driverEntityCodec,
      passenger: passengerEntityCodec,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      kind: ioKeyOf({ 'one-way': null, 'two-way': null }),
      status: ioLiteral('to-schedule'),
      nature: ioKeyOf({ medical: null, standard: null })
    })
  ],
  'toScheduleCodec'
);

export const returnDriveCodec: Type<ReturnDrive> = ioIntersection(
  [
    driveCodec,
    durationDistanceCodec,
    ioType({
      driver: driverEntityCodec,
      status: ioLiteral('return-drive')
    })
  ],
  'returnDriveCodec'
);

export const toEditCodec: Type<ToEdit> = ioIntersection(
  [
    driveCodec,
    durationDistanceCodec,
    ioType({
      driver: driverEntityCodec,
      passenger: passengerEntityCodec,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      kind: ioKeyOf({ 'one-way': null, 'two-way': null }),
      status: ioLiteral('to-edit'),
      nature: ioKeyOf({ medical: null, standard: null })
    })
  ],
  'toEditCodec'
);

export const fareToEditCodec: Type<Entity & ToEdit> = ioIntersection([entityCodec, toEditCodec], 'fareToEditCodec');

export const pendingReturnCodec: Type<Entity & Pending> = ioIntersection(
  [
    entityCodec,
    driveCodec,
    ioType({
      passenger: passengerEntityCodec,
      driver: driverEntityCodec,
      kind: ioLiteral('two-way'),
      status: ioLiteral('pending-return'),
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

export const subcontractorCodec: Type<Subcontractor> = ioType({
  identity: ioString
});

export const fareToSubcontractCodec: Type<Entity & ToSubcontract> = ioIntersection(
  [
    entityCodec,
    ioType({
      subcontractor: subcontractorCodec,
      status: ioLiteral('to-subcontract')
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

export const toSubcontractCodec: Type<ToSubcontract> = ioType(
  {
    subcontractor: subcontractorCodec,
    status: ioLiteral('to-subcontract')
  },
  'toSubcontractCodec'
);
