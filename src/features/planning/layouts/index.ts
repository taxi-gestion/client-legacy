import { DailyPlanningLayout } from './daily-planning/daily-planning.layout';
import { DailyPlanningListLayout } from './daily-planning-list/daily-planning-list.layout';
import { BillingLayout } from './billing/billing.layout';

export * from './daily-planning/daily-planning.layout';

// eslint-disable-next-line @typescript-eslint/typedef
export const LAYOUTS = [DailyPlanningLayout, DailyPlanningListLayout, BillingLayout];
