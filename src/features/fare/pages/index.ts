import { ScheduleFarePage } from './schedule-fare/schedule-fare.page';
import { EditFarePage } from './edit-fare/edit-fare.page';
import { SchedulePendingPage } from './schedule-pending/schedule-pending.page';

export * from './edit-fare/edit-fare.page';
export * from './schedule-fare/schedule-fare.page';
export * from './schedule-pending/schedule-pending.page';

// eslint-disable-next-line @typescript-eslint/typedef
export const PAGES = [EditFarePage, ScheduleFarePage, SchedulePendingPage];
