import { array as ioArray, type as ioType, Type, union as ioUnion, undefined as ioUndefined } from 'io-ts';
import {
  Entity,
  FaresDeleted,
  FaresEdited,
  FaresScheduled,
  FaresSubcontracted,
  Pending,
  PendingScheduled,
  Regular,
  RegularDetails,
  RegularRegistered,
  Scheduled,
  Subcontracted
} from '../definitions';
import {
  pendingReturnCodec,
  regularDetailsEntityCodec,
  regularPassengerEntityCodec,
  scheduledFareCodec,
  subcontractedFareCodec
} from './domain';

export const fareScheduledCodec: Type<FaresScheduled> = ioType({
  scheduledCreated: scheduledFareCodec,
  pendingCreated: ioUnion([pendingReturnCodec, ioUndefined])
});

export const faresDeletedCodec: Type<FaresDeleted> = ioType({
  scheduledDeleted: scheduledFareCodec,
  pendingDeleted: ioUnion([pendingReturnCodec, ioUndefined])
});

export const faresSubcontractedCodec: Type<FaresSubcontracted> = ioType({
  subcontracted: subcontractedFareCodec,
  scheduledDeleted: scheduledFareCodec,
  pendingDeleted: ioUnion([pendingReturnCodec, ioUndefined])
});

export const faresEditedCodec: Type<FaresEdited> = ioType({
  scheduledEdited: scheduledFareCodec,
  pendingCreated: ioUnion([pendingReturnCodec, ioUndefined]),
  pendingDeleted: ioUnion([pendingReturnCodec, ioUndefined])
});

export const regularRegisteredCodec: Type<RegularRegistered> = ioType({
  regularRegistered: regularDetailsEntityCodec
});

export const pendingScheduledCodec: Type<PendingScheduled> = ioType({
  scheduledCreated: scheduledFareCodec,
  pendingDeleted: pendingReturnCodec
});

export const regularsCodec: Type<(Entity & Regular)[]> = ioArray(regularPassengerEntityCodec);
export const regularsDetailsCodec: Type<(Entity & RegularDetails)[]> = ioArray(regularDetailsEntityCodec);
export const pendingReturnsCodec: Type<(Entity & Pending)[]> = ioArray(pendingReturnCodec);
export const scheduledFaresCodec: Type<(Entity & Scheduled)[]> = ioArray(scheduledFareCodec);
export const subcontractedFaresCodec: Type<(Entity & Subcontracted)[]> = ioArray(subcontractedFareCodec);
