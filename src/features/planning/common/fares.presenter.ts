import { DailyDriverPlanning, ScheduledPlanningSession, ScheduledPresentation } from './fares.presentation';
import { minutesSinceStartOfDayInTimezone, timeInTimezone } from './unit-convertion';
import { secondsToMinutes } from 'date-fns';
import { Place, Scheduled } from '@domain';

export const defaultPlaceValue: Place = {
  context: '',
  label: '',
  location: {
    latitude: NaN,
    longitude: NaN
  }
};

export const groupByDriverPlanning = (faresList: ScheduledPlanningSession[]): DailyDriverPlanning[] => {
  const groups: Record<string, ScheduledPlanningSession[]> = faresList.reduce<Record<string, ScheduledPlanningSession[]>>(
    (
      acc: Record<string, ScheduledPlanningSession[]>,
      fare: ScheduledPlanningSession
    ): Record<string, ScheduledPlanningSession[]> => {
      if (acc[fare.driver] == null) {
        // eslint-disable-next-line no-param-reassign
        acc[fare.driver] = [];
      }
      acc[fare.driver]?.push(fare);
      return acc;
    },
    {}
  );

  return Object.entries(groups).map<DailyDriverPlanning>(
    ([driver, fares]: [string, ScheduledPlanningSession[]]): DailyDriverPlanning => ({
      driver,
      fares
    })
  );
};

export const filterByPlanning =
  (planningToKeep: string) =>
  (faresList: ScheduledPresentation[]): ScheduledPresentation[] =>
    faresList.filter((fare: ScheduledPresentation): boolean => fare.driver === planningToKeep);

export const toScheduledFaresPresentation = (fares: Scheduled[]): ScheduledPresentation[] =>
  fares.map(toScheduledFarePresentation);

export const toFaresForDatePlanningSession = (fares: ScheduledPresentation[]): ScheduledPlanningSession[] =>
  fares.map(toScheduledPlanningSession);

export const toScheduledFarePresentation = (fare: Scheduled): ScheduledPresentation => ({
  passenger: fare.passenger,
  creator: fare.creator,
  departure: fare.departure,
  destination: fare.destination,
  distance: Number(fare.distance),
  duration: Number(fare.duration),
  kind: fare.kind,
  nature: fare.nature,
  phone: fare.phone.replace(' ', ''),
  driver: fare.driver,
  status: fare.status,
  datetime: fare.datetime,
  localTime: timeInTimezone(fare.datetime, 'Europe/Paris')
});

export const toScheduledPlanningSession = (fare: ScheduledPresentation): ScheduledPlanningSession => ({
  startTimeInMinutes: minutesSinceStartOfDayInTimezone(fare.datetime, 'Europe/Paris'),
  passenger: fare.passenger,
  creator: fare.creator,
  departure: fare.departure,
  destination: fare.destination,
  distance: Number((fare.distance * 0.001).toPrecision(3)),
  duration: secondsToMinutes(fare.duration),
  kind: fare.kind,
  nature: fare.nature,
  phone: fare.phone,
  driver: fare.driver,
  status: fare.status,
  datetime: fare.datetime,
  localTime: fare.localTime
});
