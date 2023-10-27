import { toIdentity } from '@features/regular';
import { DailyDriverPlanning, ScheduledPlanningSession, sortByDatetime } from '../../common/agenda.presenter';

export type DailyDriverPlanningListPresentation = {
  driver: string;
  fares: FareListItem[];
};

export type FareListItem = {
  id: string;
  passenger: string;
  time: string;
  datetime: string;
  isMedicalDrive: boolean;
  isTwoWayDrive: boolean;
};

export const toDailyDriverPlanningListPresentation = (
  dailyDriverPlannings: DailyDriverPlanning[]
): DailyDriverPlanningListPresentation[] => dailyDriverPlannings.map(toListPresentation);

const toListPresentation = (dailyDriverPlanning: DailyDriverPlanning): DailyDriverPlanningListPresentation => ({
  driver: dailyDriverPlanning.driver.username,
  fares: sortByDatetime(toFareListItems(dailyDriverPlanning.fares))
});

const toFareListItems = (fares: ScheduledPlanningSession[]): FareListItem[] => fares.map(toFareListItem);

const toFareListItem = (fare: ScheduledPlanningSession): FareListItem => ({
  id: fare.id,
  passenger: toIdentity(fare.passenger),
  time: fare.localTime,
  datetime: fare.datetime,
  isMedicalDrive: fare.isMedicalDrive,
  isTwoWayDrive: fare.isTwoWayDrive
});
