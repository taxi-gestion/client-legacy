import { array as ioArray, type as ioType, Type, undefined as ioUndefined, union as ioUnion } from 'io-ts';
import {
  Entity,
  FaresDeleted,
  FaresEdited,
  FaresScheduled,
  FaresSubcontracted,
  Pending,
  PendingScheduled,
  RegularDeleted,
  RegularDetails,
  RegularEdited,
  RegularRegistered,
  Scheduled,
  Subcontracted
} from '../definitions';
import { pendingReturnCodec, regularDetailsEntityCodec, scheduledFareCodec, subcontractedFareCodec } from './domain';

export const fareScheduledCodec: Type<FaresScheduled> = ioType(
  {
    scheduledCreated: scheduledFareCodec,
    pendingCreated: ioUnion([pendingReturnCodec, ioUndefined])
  },
  'fareScheduledCodec'
);

export const faresDeletedCodec: Type<FaresDeleted> = ioType(
  {
    scheduledDeleted: scheduledFareCodec,
    pendingDeleted: ioUnion([pendingReturnCodec, ioUndefined])
  },
  'faresDeletedCodec'
);

export const faresSubcontractedCodec: Type<FaresSubcontracted> = ioType(
  {
    subcontracted: subcontractedFareCodec,
    scheduledDeleted: scheduledFareCodec,
    pendingDeleted: ioUnion([pendingReturnCodec, ioUndefined])
  },
  'faresSubcontractedCodec'
);

export const faresEditedCodec: Type<FaresEdited> = ioType(
  {
    scheduledEdited: scheduledFareCodec,
    pendingCreated: ioUnion([pendingReturnCodec, ioUndefined]),
    pendingDeleted: ioUnion([pendingReturnCodec, ioUndefined])
  },
  'faresEditedCodec'
);

export const regularRegisteredCodec: Type<RegularRegistered> = ioType(
  {
    regularRegistered: regularDetailsEntityCodec
  },
  'regularRegisteredCodec'
);

export const regularDeletedCodec: Type<RegularDeleted> = ioType(
  {
    regularDeleted: regularDetailsEntityCodec
  },
  'regularDeletedCodec'
);

export const regularEditedCodec: Type<RegularEdited> = ioType(
  {
    regularEdited: regularDetailsEntityCodec
  },
  'regularEditedCodec'
);

export const pendingScheduledCodec: Type<PendingScheduled> = ioType(
  {
    scheduledCreated: scheduledFareCodec,
    pendingDeleted: pendingReturnCodec
  },
  'regularEditedCodec'
);

export const regularsDetailsCodec: Type<(Entity & RegularDetails)[]> = ioArray(
  regularDetailsEntityCodec,
  'regularsDetailsCodec'
);
export const pendingReturnsCodec: Type<(Entity & Pending)[]> = ioArray(pendingReturnCodec, 'pendingReturnsCodec');
export const scheduledFaresCodec: Type<(Entity & Scheduled)[]> = ioArray(scheduledFareCodec, 'scheduledFaresCodec');
export const subcontractedFaresCodec: Type<(Entity & Subcontracted)[]> = ioArray(
  subcontractedFareCodec,
  'subcontractedFaresCodec'
);

export const driversWithOrderCodec: Type<(Entity & Scheduled)[]> = ioArray(scheduledFareCodec, 'scheduledFaresCodec');
