import { ScheduledPresentation } from '../../common/fares.presentation';
import { formatDateToDatetimeLocalString, metersToKilometers, secondsToMinutes } from '../../common/unit-convertion';

export const toAgendaFares = (fares: ScheduledPresentation[]): ScheduledPresentation[] => fares.map(toAgendaFare);

const toAgendaFare = (fare: ScheduledPresentation): ScheduledPresentation => ({
  ...fare,
  duration: secondsToMinutes(fare.duration),
  distance: metersToKilometers(fare.distance),
  datetime: formatDateToDatetimeLocalString(new Date(fare.datetime)).split('T')[1] ?? ''
});

/* eslint-disable */
export const sortByDatetime = (fares: ScheduledPresentation[]): ScheduledPresentation[] =>
  fares.sort((a, b) => {
    const aMinutes = parseInt(a.datetime.split(':')[0]!) * 60 + parseInt(a.datetime.split(':')[1]!);
    const bMinutes = parseInt(b.datetime.split(':')[0]!) * 60 + parseInt(b.datetime.split(':')[1]!);
    return aMinutes - bMinutes;
  });
/* eslint-enable */
