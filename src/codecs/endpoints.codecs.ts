import { array as ioArray, number as ioNumber, Type, type as ioType, undefined as ioUndefined, union as ioUnion } from 'io-ts';
import {
  AllocateUnassigned,
  DeleteFare,
  DeleteRegular,
  EditRegular,
  EditScheduled,
  Entity,
  FaresCount,
  Pending,
  RegisterRegular,
  Regular,
  RegularHistory,
  Scheduled,
  SchedulePending,
  ScheduleScheduled,
  ScheduleUnassigned,
  Subcontracted,
  SubcontractFare,
  Unassigned
} from '../definitions';
import {
  pendingReturnCodec,
  regularEntityCodec,
  scheduledFareCodec,
  subcontractedFareCodec,
  unassignedFareCodec
} from './domain';

export const scheduleScheduledCodec: Type<ScheduleScheduled> = ioType(
  {
    scheduledCreated: scheduledFareCodec,
    pendingCreated: ioUnion([pendingReturnCodec, ioUndefined])
  },
  'scheduleScheduledCodec'
);

export const faresDeletedCodec: Type<DeleteFare> = ioType(
  {
    scheduledDeleted: ioUnion([scheduledFareCodec, ioUndefined]),
    pendingDeleted: ioUnion([pendingReturnCodec, ioUndefined]),
    unassignedDeleted: ioUnion([unassignedFareCodec, ioUndefined])
  },
  'faresDeletedCodec'
);

export const faresSubcontractedCodec: Type<SubcontractFare> = ioType(
  {
    subcontracted: subcontractedFareCodec,
    scheduledDeleted: ioUnion([scheduledFareCodec, ioUndefined]),
    pendingDeleted: ioUnion([pendingReturnCodec, ioUndefined])
  },
  'faresSubcontractedCodec'
);

export const scheduledEditedCodec: Type<EditScheduled> = ioType(
  {
    scheduledEdited: scheduledFareCodec,
    pendingCreated: ioUnion([pendingReturnCodec, ioUndefined]),
    pendingDeleted: ioUnion([pendingReturnCodec, ioUndefined])
  },
  'scheduleEditedCodec'
);

export const unassignedAllocatedCodec: Type<AllocateUnassigned> = ioType(
  {
    unassignedCreated: unassignedFareCodec
  },
  'unassignedAllocatedCodec'
);

export const regularRegisteredCodec: Type<RegisterRegular> = ioType(
  {
    regularRegistered: regularEntityCodec
  },
  'regularRegisteredCodec'
);

export const regularDeletedCodec: Type<DeleteRegular> = ioType(
  {
    regularDeleted: regularEntityCodec
  },
  'regularDeletedCodec'
);

export const regularEditedCodec: Type<EditRegular> = ioType(
  {
    regularEdited: regularEntityCodec
  },
  'regularEditedCodec'
);

export const pendingScheduledCodec: Type<SchedulePending> = ioType(
  {
    scheduledCreated: scheduledFareCodec,
    pendingDeleted: pendingReturnCodec
  },
  'regularEditedCodec'
);

export const unassignedScheduledCodec: Type<ScheduleUnassigned> = ioType(
  {
    scheduledCreated: scheduledFareCodec,
    unassignedDeleted: unassignedFareCodec,
    pendingCreated: ioUnion([pendingReturnCodec, ioUndefined])
  },
  'unassignedScheduledCodec'
);

export const regularsCodec: Type<(Entity & Regular)[]> = ioArray(regularEntityCodec, 'regularsDetailsCodec');
export const pendingReturnsCodec: Type<(Entity & Pending)[]> = ioArray(pendingReturnCodec, 'pendingReturnsCodec');
export const scheduledFaresCodec: Type<(Entity & Scheduled)[]> = ioArray(scheduledFareCodec, 'scheduledFaresCodec');
export const unassignedFaresCodec: Type<(Entity & Unassigned)[]> = ioArray(unassignedFareCodec, 'unassignedFaresCodec');
export const subcontractedFaresCodec: Type<(Entity & Subcontracted)[]> = ioArray(
  subcontractedFareCodec,
  'subcontractedFaresCodec'
);

export const driversWithOrderCodec: Type<(Entity & Scheduled)[]> = ioArray(scheduledFareCodec, 'scheduledFaresCodec');

export const faresCountCodec: Type<FaresCount> = ioType({
  scheduled: ioNumber,
  pending: ioNumber,
  subcontracted: ioNumber,
  unassigned: ioNumber
});

export const regularHistoryCodec: Type<RegularHistory> = ioType({
  scheduled: scheduledFaresCodec,
  pending: pendingReturnsCodec,
  subcontracted: subcontractedFaresCodec,
  unassigned: unassignedFaresCodec
});
