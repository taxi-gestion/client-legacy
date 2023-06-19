import { DailyPage } from './daily/daily.page';
import { ScheduleFarePage } from './schedule-fare/schedule-fare.page';
import { DriverAgendaPage } from './driver-agenda/driver-agenda-page.component';

export * from './daily/daily.page';
export * from './schedule-fare/schedule-fare.page';

// eslint-disable-next-line @typescript-eslint/typedef
export const PAGES = [DailyPage, ScheduleFarePage, DriverAgendaPage];
