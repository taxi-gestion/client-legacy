import { ScheduledPresentation } from '../../common/fares.presentation';
import { formatDateToDatetimeLocalString, metersToKilometers, secondsToMinutes } from '../../common/unit-convertion';

export const toAgendaFares = (fares: ScheduledPresentation[]): ScheduledPresentation[] => fares.map(toAgendaFare);

const toAgendaFare = (fare: ScheduledPresentation): ScheduledPresentation => ({
  ...fare,
  duration: secondsToMinutes(fare.duration),
  distance: metersToKilometers(fare.duration),
  datetime: formatDateToDatetimeLocalString(new Date(fare.datetime)).split('T')[1] ?? ''
});

export const sortByDatetime = (fares: ScheduledPresentation[]): ScheduledPresentation[] =>
  fares.sort(
    (fareA: ScheduledPresentation, fareB: ScheduledPresentation): number =>
      new Date(fareA.datetime).getTime() - new Date(fareB.datetime).getTime()
  );
