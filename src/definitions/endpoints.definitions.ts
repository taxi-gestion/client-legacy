import { Entity, Pending, Regular, Scheduled, Subcontracted } from './domain.definitions';

export type FaresScheduled = {
  scheduledCreated: Entity & Scheduled;
  pendingCreated?: Entity & Pending;
};

export type FaresDeleted = {
  scheduledDeleted: Entity & Scheduled;
  pendingDeleted?: Entity & Pending;
};

export type FaresEdited = {
  scheduledEdited: Entity & Scheduled;
  pendingCreated?: Entity & Pending;
  pendingDeleted?: Entity & Pending;
};

export type FaresSubcontracted = {
  subcontracted: Entity & Subcontracted;
  scheduledDeleted: Entity & Scheduled;
  pendingDeleted?: Entity & Pending;
};

export type PendingScheduled = {
  scheduledCreated: Entity & Scheduled;
  pendingDeleted: Entity & Pending;
};

export type RegularRegistered = {
  regularRegistered: Entity & Regular;
};
