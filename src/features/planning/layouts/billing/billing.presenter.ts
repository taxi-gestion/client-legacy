import { DailyDriverPlanning, ScheduledPlanningSession } from '../../common/fares.presentation';
import { toIdentity } from '@features/common/regular';

export type BillingByDriverPresentation = {
  driver: string;
  fares: BillingListItem[];
};

export type BillingListItem = {
  passenger: string;
  time: string;
  departure: string;
  destination: string;
  isMedicalDrive: boolean;
  isTwoWayDrive: boolean;
};

export const toBillingByDriverPresentation = (dailyDriverPlannings: DailyDriverPlanning[]): BillingByDriverPresentation[] =>
  dailyDriverPlannings.map(toListPresentation);

const toListPresentation = (dailyDriverPlanning: DailyDriverPlanning): BillingByDriverPresentation => ({
  driver: dailyDriverPlanning.driver.username,
  fares: toBillingListItems(dailyDriverPlanning.fares)
});

const toBillingListItems = (fares: ScheduledPlanningSession[]): BillingListItem[] => fares.map(toBillingListItem);

const toBillingListItem = (fare: ScheduledPlanningSession): BillingListItem => ({
  passenger: toIdentity(fare.passenger),
  time: fare.localTime,
  departure: fare.departure.context,
  destination: fare.destination.context,
  isMedicalDrive: fare.isMedicalDrive,
  isTwoWayDrive: fare.isTwoWayDrive
});
