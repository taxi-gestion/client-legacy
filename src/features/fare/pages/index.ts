import { ScheduleFarePage } from './schedule-fare/schedule-fare.page';
import { EditScheduledPage } from './edit-scheduled/edit-scheduled.page';
import { SchedulePendingPage } from './schedule-pending/schedule-pending.page';
import { ScheduleUnassignedPage } from './schedule-unassigned/schedule-unassigned.page';
import { AddRecurringPage } from './add-recurring/add-recurring.page';
import { EditRecurringPage } from './edit-recurring/edit-recurring.page';
import { PlanWithContextPage } from './plan-with-context/plan-with-context.page';
import { SubcontractedPage } from './subcontracted-fares/subcontracted-fares.page';

export * from './edit-scheduled/edit-scheduled.page';
export * from './schedule-fare/schedule-fare.page';
export * from './schedule-pending/schedule-pending.page';
export * from './add-recurring/add-recurring.page';
export * from './edit-recurring/edit-recurring.page';

// eslint-disable-next-line @typescript-eslint/typedef
export const PAGES = [
  EditScheduledPage,
  ScheduleFarePage,
  SchedulePendingPage,
  ScheduleUnassignedPage,
  AddRecurringPage,
  EditRecurringPage,
  PlanWithContextPage,
  SubcontractedPage
];
