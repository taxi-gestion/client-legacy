import { isValid, parseISO } from 'date-fns';
import { Params } from '@angular/router';
import { toStandardDateFormat } from './unit-convertion';

export const isValidDate = (dateString: string): boolean => {
  try {
    return isValid(parseISO(dateString));
  } catch (_) {
    return false;
  }
};

export const paramsToDateDayString = (params: Params): string => {
  // eslint-disable-next-line prefer-destructuring
  const date: unknown = params['date'];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const isDateValid: boolean = date === null || typeof date !== 'string' ? false : isValidDate(date);
  return toStandardDateFormat(isDateValid ? parseISO(date as string) : new Date());
};
