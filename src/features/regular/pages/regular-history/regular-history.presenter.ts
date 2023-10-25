import { RegularHistory, Scheduled } from '../../../../definitions';
import { RegularHistoryScheduledItem, RegularHistoryValues } from '../../common/regular.presentation';
import { format } from 'date-fns';

// eslint-disable-next-line @typescript-eslint/no-shadow
export const toRegularHistoryValues = (history: RegularHistory): RegularHistoryValues => ({
  scheduled: history.scheduled.map(toRegularHistoryScheduledItem)
});

const toRegularHistoryScheduledItem = (fare: Scheduled): RegularHistoryScheduledItem => ({
  datetime: format(new Date(fare.datetime), "dd/MM/yyyy 'à' HH'h'mm"),
  isMedicalDrive: fare.nature === 'medical',
  isTwoWayDrive: fare.kind === 'two-way',
  driver: fare.driver.username,
  duration: fare.duration,
  distance: fare.distance,
  departure: fare.departure.name,
  arrival: fare.arrival.name
});
