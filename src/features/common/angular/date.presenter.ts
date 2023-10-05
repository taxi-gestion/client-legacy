import { isValid, parseISO } from 'date-fns';
import { Params } from '@angular/router';
import { format } from 'date-fns-tz';

export const toStandardDateFormat = (date: Date): string => format(date, 'yyyy-MM-dd');

export const isValidDate = (dateString: string): boolean => {
  try {
    return isValid(parseISO(dateString));
  } catch (_) {
    return false;
  }
};

export const routeParamToDateString = (keyInParams: string, params: Params, fallbackDate: Date): string => {
  // eslint-disable-next-line prefer-destructuring
  const date: unknown = params[keyInParams];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const isDateValid: boolean = date === null || typeof date !== 'string' ? false : isValidDate(date);
  return toStandardDateFormat(isDateValid ? parseISO(date as string) : fallbackDate);
};
