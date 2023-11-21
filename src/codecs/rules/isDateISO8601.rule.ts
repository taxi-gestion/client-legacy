import * as t from 'io-ts';
import { BrandC, StringC } from 'io-ts';
import { isEqual, isValid, parseISO } from 'date-fns';
import { TypeOf } from 'io-ts/Decoder';

export const isDateISO8601String: BrandC<StringC, DateISO8601Brand> = t.brand(
  t.string,
  (date: string): date is t.Branded<string, DateISO8601Brand> => matchDateISO8601(date) && isValidDate(date),
  'isDateISO8601'
);

const matchDateISO8601 = (date: string): boolean => /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/gu.test(date);

const isValidDate = (date: string): boolean => {
  const parsedDate: Date = parseISO(date);
  return isValid(parsedDate) && isEqual(parsedDate, new Date(date));
};

export type DateISO8601 = TypeOf<typeof isDateISO8601String>;

type DateISO8601Brand = {
  readonly isDateISO8601: unique symbol;
};
