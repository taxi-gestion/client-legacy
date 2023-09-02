import { array as ioArray, type as ioType, Type, union as ioUnion } from 'io-ts';
import {
  Entity,
  FaresDeleted,
  FaresEdited,
  FaresScheduled,
  FaresSubcontracted,
  Pending,
  PendingScheduled,
  Regular,
  RegularRegistered,
  Scheduled,
  Subcontracted
} from '../definitions';
import { pendingReturnCodec, regularPassengerEntityCodec, scheduledFareCodec, subcontractedFareCodec } from './domain';

export const fareScheduledCodec: Type<FaresScheduled> = ioUnion([
  ioType({
    scheduledCreated: scheduledFareCodec
  }),
  ioType({
    scheduledCreated: scheduledFareCodec,
    pendingCreated: pendingReturnCodec
  })
]);

export const faresDeletedCodec: Type<FaresDeleted> = ioUnion([
  ioType({
    scheduledDeleted: scheduledFareCodec
  }),
  ioType({
    scheduledDeleted: scheduledFareCodec,
    pendingDeleted: pendingReturnCodec
  })
]);

export const faresSubcontractedCodec: Type<FaresSubcontracted> = ioUnion([
  ioType({
    subcontracted: subcontractedFareCodec,
    scheduledDeleted: scheduledFareCodec
  }),
  ioType({
    subcontracted: subcontractedFareCodec,
    scheduledDeleted: scheduledFareCodec,
    pendingDeleted: pendingReturnCodec
  })
]);

export const faresEditedCodec: Type<FaresEdited> = ioUnion([
  ioType({
    scheduledEdited: scheduledFareCodec
  }),
  ioType({
    scheduledEdited: scheduledFareCodec,
    pendingCreated: pendingReturnCodec
  }),
  ioType({
    scheduledEdited: scheduledFareCodec,
    pendingCreated: pendingReturnCodec,
    pendingDeleted: pendingReturnCodec
  }),
  ioType({
    scheduledEdited: scheduledFareCodec,
    pendingDeleted: pendingReturnCodec
  })
]);

export const regularRegisteredCodec: Type<RegularRegistered> = ioType({
  regularRegistered: regularPassengerEntityCodec
});

export const pendingScheduledCodec: Type<PendingScheduled> = ioType({
  scheduledCreated: scheduledFareCodec,
  pendingDeleted: pendingReturnCodec
});

export const regularsCodec: Type<(Entity & Regular)[]> = ioArray(regularPassengerEntityCodec);
export const pendingReturnsCodec: Type<(Entity & Pending)[]> = ioArray(pendingReturnCodec);
export const scheduledFaresCodec: Type<(Entity & Scheduled)[]> = ioArray(scheduledFareCodec);
export const subcontractedFaresCodec: Type<(Entity & Subcontracted)[]> = ioArray(subcontractedFareCodec);
