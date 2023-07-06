import { FaresToScheduleForDate, FareToScheduleForDate } from '@features/planning';
import {
  FaresToScheduleForDatePresentation,
  FareToScheduleForDatePresentation
} from '@features/planning/common/fares-to-schedule.presentation';
import { metersToKilometers } from '@features/planning/common/unit-convertion';

export const toFaresToScheduleForDatePresentation = (fares: FaresToScheduleForDate): FaresToScheduleForDatePresentation =>
  fares.map(toFareToScheduleForDatePresentation);

export const toFareToScheduleForDatePresentation = (fare: FareToScheduleForDate): FareToScheduleForDatePresentation => ({
  client: fare.client,
  creator: fare.creator,
  departure: fare.departure,
  destination: fare.destination,
  distance: metersToKilometers(Number(fare.distance)),
  duration: Number(fare.duration),
  kind: fare.kind,
  nature: fare.nature,
  phone: fare.phone.replace(' ', ''),
  planning: fare.planning,
  status: 'to-schedule',
  time: fare.time?.substring(1)
});
