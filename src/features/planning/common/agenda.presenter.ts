import { ScheduledPresentation } from './fares.presentation';
import { formatDateToDatetimeLocalString, metersToKilometers, secondsToMinutes } from './unit-convertion';
import { passengerIdentity } from './regular.presenter';
import { PhoneValues } from '@features/common/phone';
import { PlaceValues } from '@features/common/place';

export const toAgendaFares = (fares: ScheduledPresentation[]): FareDriverCardPresentation[] => fares.map(toAgendaFare);

const toAgendaFare = (fare: ScheduledPresentation): FareDriverCardPresentation => ({
  //...fare,
  duration: String(secondsToMinutes(fare.duration)),
  distance: String(metersToKilometers(fare.distance)),
  datetime: fare.datetime,
  phoneToCall: fare.passenger.phone.phoneNumber,
  phoneDisplay: phoneDisplay(fare.passenger.phone),
  isMedicalDrive: fare.isMedicalDrive,
  isTwoWayDrive: fare.isTwoWayDrive,
  departure: fare.departure,
  destination: fare.destination,
  title: cardTitle(fare)
});

export type FareDriverCardPresentation = {
  title: string;
  duration: string;
  distance: string;
  datetime: string;
  isMedicalDrive: boolean;
  isTwoWayDrive: boolean;
  phoneToCall: string;
  phoneDisplay: string;
  departure: PlaceValues;
  destination: PlaceValues;
};

const cardTitle = (fare: ScheduledPresentation): string => `${datetime(fare.datetime)} - ${passengerIdentity(fare.passenger)}`;

const datetime = (datetimeString: string): string =>
  formatDateToDatetimeLocalString(new Date(datetimeString)).split('T')[1] ?? '';

const phoneDisplay = (phone: PhoneValues): string => `tèl ${phone.phoneType} - ${phone.phoneNumber}`;
