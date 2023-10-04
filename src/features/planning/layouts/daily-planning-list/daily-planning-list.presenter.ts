import { DailyDriverPlanning, ScheduledPlanningSession } from '../../common/fares.presentation';
import { toIdentity } from '@features/common/regular';
import { sortByTime } from '../../common/time.presenter';

export type DailyDriverPlanningListPresentation = {
  driver: string;
  fares: FareListItem[];
};

export type FareListItem = {
  passenger: string;
  time: string;
};

export const toDailyDriverPlanningListPresentation = (
  dailyDriverPlannings: DailyDriverPlanning[]
): DailyDriverPlanningListPresentation[] => dailyDriverPlannings.map(toListPresentation);

const toListPresentation = (dailyDriverPlanning: DailyDriverPlanning): DailyDriverPlanningListPresentation => ({
  driver: dailyDriverPlanning.driver.username,
  fares: sortByTime(toFareListItems(dailyDriverPlanning.fares))
});

const toFareListItems = (fares: ScheduledPlanningSession[]): FareListItem[] => fares.map(toFareListItem);

const toFareListItem = (fare: ScheduledPlanningSession): FareListItem => ({
  passenger: toIdentity(fare.passenger),
  time: fare.localTime
});
