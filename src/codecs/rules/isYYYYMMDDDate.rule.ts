import * as t from 'io-ts';
import { BrandC, StringC } from 'io-ts';
import { isValid } from 'date-fns';

export const isYYYYMMDDDate: BrandC<StringC, DateBrand> = t.brand(
  t.string,
  (date: string): date is t.Branded<string, DateBrand> => matchDate(date) && isValid(new Date(date)),
  'isDate'
);

const matchDate = (date: string): boolean => /^\d{4}-\d{2}-\d{2}$/gu.test(date);

type DateBrand = {
  readonly isDate: unique symbol;
};
