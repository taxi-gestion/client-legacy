import { Entity, Pending, Regular, Scheduled, Subcontracted } from './domain.definitions';

export type FaresScheduled = {
  scheduledCreated: Entity & Scheduled;
  pendingCreated: (Entity & Pending) | undefined;
};

export type FaresDeleted = {
  scheduledDeleted: Entity & Scheduled;
  pendingDeleted: (Entity & Pending) | undefined;
};

export type FaresEdited = {
  scheduledEdited: Entity & Scheduled;
  pendingCreated: (Entity & Pending) | undefined;
  pendingDeleted: (Entity & Pending) | undefined;
};

export type FaresSubcontracted = {
  subcontracted: Entity & Subcontracted;
  scheduledDeleted: Entity & Scheduled;
  pendingDeleted: (Entity & Pending) | undefined;
};

export type PendingScheduled = {
  scheduledCreated: Entity & Scheduled;
  pendingDeleted: Entity & Pending;
};

export type RegularRegistered = {
  regularRegistered: Entity & Regular;
};
