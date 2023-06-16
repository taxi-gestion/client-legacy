import { DailyPage } from './daily/daily.page';
import { ScheduleFarePage } from './schedule-fare/schedule-fare.page';
import { DailyDriverPage } from './daily-driver/daily-driver.page';

export * from './daily/daily.page';
export * from './schedule-fare/schedule-fare.page';

// eslint-disable-next-line @typescript-eslint/typedef
export const PAGES = [DailyPage, ScheduleFarePage, DailyDriverPage];
