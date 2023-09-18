import { isValid, parseISO } from 'date-fns';

export const isValidDate = (dateString: string): boolean => {
  try {
    return isValid(parseISO(dateString));
  } catch (_) {
    return false;
  }
};
