import { Params } from '@angular/router';
import { toStandardDateFormat } from '../../common/unit-convertion';
import { isValid, parseISO } from 'date-fns'; // Assuming you are using date-fns, based on your usage of the format function

export const paramsToDateDayString = (params: Params): string => {
  // eslint-disable-next-line prefer-destructuring
  const date: unknown = params['date'];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const isDateValid: boolean = date === null || typeof date !== 'string' ? false : isValidDate(date);
  return toStandardDateFormat(isDateValid ? parseISO(date as string) : new Date());
};

const isValidDate = (dateString: string): boolean => {
  try {
    return isValid(parseISO(dateString));
  } catch (_) {
    return false;
  }
};
