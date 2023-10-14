import { metersToKilometers, secondsToMinutes, toTime } from '@features/common/presentation';
import { PhoneValues } from '@features/common/phone';
import { passengerIdentity } from '../../regular/common/regular.presenter';
import { WaypointValues } from '@features/common/waypoint';
import { Entity } from '@definitions';
import { ScheduledFareValues } from '@features/fare';
import { PlanningSession } from '../components/planning/planning-row/planning-row.component';
import { DriverValues } from '@features/common/driver';

export type DailyDriverPlanning = {
  driver: DriverValues;
  fares: ScheduledPlanningSession[];
};

export type ScheduledPresentation = Entity & ScheduledFareValues & { localTime: string };

export type ScheduledPlanningSession = PlanningSession & ScheduledPresentation;

export const toAgendaFares = (fares: ScheduledPresentation[]): FareDriverCardPresentation[] => fares.map(toAgendaFare);

const toAgendaFare = (fare: ScheduledPresentation): FareDriverCardPresentation => ({
  duration: String(secondsToMinutes(fare.duration)),
  distance: String(metersToKilometers(fare.distance)),
  datetime: fare.datetime,
  phone: fare.passenger.phone,
  isMedicalDrive: fare.isMedicalDrive,
  isTwoWayDrive: fare.isTwoWayDrive,
  departure: fare.departure,
  arrival: fare.arrival,
  title: cardTitle(fare),
  passengerComment: fare.passenger.comment
});

export type FareDriverCardPresentation = {
  title: string;
  duration: string;
  distance: string;
  datetime: string;
  isMedicalDrive: boolean;
  isTwoWayDrive: boolean;
  phone: PhoneValues;
  departure: WaypointValues;
  arrival: WaypointValues;
  passengerComment: string | undefined;
};

const cardTitle = (fare: ScheduledPresentation): string => `${toTime(fare.datetime)} - ${passengerIdentity(fare.passenger)}`;
// TODO Do I really need to explain how ugly this is ?
export const sortByDatetime = <T extends { datetime: string }>(elements: T[]): T[] =>
  elements.sort((elem1: T, elem2: T): number => Date.parse(elem1.datetime) - Date.parse(elem2.datetime));
