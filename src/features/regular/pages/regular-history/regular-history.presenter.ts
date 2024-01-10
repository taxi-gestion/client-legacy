import { RegularHistory, Scheduled } from '../../../../definitions';
import { RegularHistoryScheduledItem, RegularHistoryValues } from '../../common/regular.presentation';
import { format } from 'date-fns';
import { Params } from '@angular/router';

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

const UUID_LENGTH: 36 = 36 as const;
const isValidUuid = (uuid: unknown): uuid is string =>
  uuid === null || typeof uuid !== 'string' ? false : uuid.length === UUID_LENGTH;
export const routeParamToRegularId = (keyInParams: string, params: Params): string | undefined => {
  const uuid: unknown = params[keyInParams];
  return isValidUuid(uuid) ? uuid : undefined;
};
