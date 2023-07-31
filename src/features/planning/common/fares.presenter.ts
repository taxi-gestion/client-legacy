import {
  DailyPlanning,
  DailyPlannings,
  FareForDatePlanningSession,
  FareForDatePresentation,
  FaresForDatePresentation
} from './fares.presentation';
import { FareForDate, FaresForDate } from '../providers';
import { isoTimeToMinutes, metersToKilometersString } from './unit-convertion';
import { Place } from '@features/place';

export const defaultPlaceValue: Place = {
  context: '',
  label: '',
  location: {
    latitude: NaN,
    longitude: NaN
  }
};

export const groupByPlanning = (faresList: DailyPlanning): DailyPlannings => {
  const groupedFares: Record<string, DailyPlanning> = faresList.reduce(
    (grouped: Record<string, DailyPlanning>, fare: FareForDatePlanningSession): Record<string, DailyPlanning> => {
      const groups: Record<string, DailyPlanning> = grouped;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const key: string = fare.planning;
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (groups[key] == null) groups[key] = [];
      groups[key]?.push(fare);
      return groups;
    },
    {}
  );

  // eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type
  return Object.entries(groupedFares).map(([planning, fares]) => ({ name: planning, fares }));
};

export const filterByPlanning =
  (planningToKeep: string) =>
  (faresList: FaresForDatePresentation): FaresForDatePresentation =>
    faresList.filter((fare: FareForDatePresentation): boolean => fare.planning === planningToKeep);

export const toFaresForDatePresentation = (fares: FaresForDate): FaresForDatePresentation =>
  fares.map(toFareForDatePresentation);

export const toFaresForDatePlanningSession = (fares: FaresForDatePresentation): DailyPlanning =>
  fares.map(toFareForDatePlanningSession);

export const toFareForDatePresentation = (fare: FareForDate): FareForDatePresentation => ({
  client: fare.client,
  creator: fare.creator,
  departure: fare.departure,
  destination: fare.destination,
  distance: metersToKilometersString(Number(fare.distance)),
  duration: Number(fare.duration),
  kind: fare.kind,
  nature: fare.nature,
  phone: fare.phone.replace(' ', ''),
  planning: fare.planning,
  status: fare.status,
  time: fare.time.substring(1)
});

export const toFareForDatePlanningSession = (fare: FareForDatePresentation): FareForDatePlanningSession => ({
  startTimeInMinutes: isoTimeToMinutes(fare.time),
  client: fare.client,
  creator: fare.creator,
  departure: fare.departure,
  destination: fare.destination,
  distance: fare.distance,
  duration: fare.duration,
  kind: fare.kind,
  nature: fare.nature,
  phone: fare.phone,
  planning: fare.planning,
  status: fare.status,
  time: fare.time
});
