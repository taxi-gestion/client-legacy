import { Params } from '@angular/router';
import { toStandardDateFormat } from '../../common/unit-convertion';
import { parseISO } from 'date-fns';
import { isValidDate } from '../../common/date.presenter';

export const paramsToDateDayString = (params: Params): string => {
  // eslint-disable-next-line prefer-destructuring
  const date: unknown = params['date'];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const isDateValid: boolean = date === null || typeof date !== 'string' ? false : isValidDate(date);
  return toStandardDateFormat(isDateValid ? parseISO(date as string) : new Date());
};
