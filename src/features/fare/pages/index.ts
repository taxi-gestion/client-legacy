import { ScheduleFarePage } from './schedule-fare/schedule-fare.page';
import { EditScheduledPage } from './edit-scheduled/edit-scheduled.page';
import { SchedulePendingPage } from './schedule-pending/schedule-pending.page';
import { ScheduleUnassignedPage } from './schedule-unassigned/schedule-unassigned.page';

export * from './edit-scheduled/edit-scheduled.page';
export * from './schedule-fare/schedule-fare.page';
export * from './schedule-pending/schedule-pending.page';

// eslint-disable-next-line @typescript-eslint/typedef
export const PAGES = [EditScheduledPage, ScheduleFarePage, SchedulePendingPage, ScheduleUnassignedPage];
