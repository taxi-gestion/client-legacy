import * as t from 'io-ts';

export const isNotEmptyString: t.BrandC<t.StringC, NotEmptyStringBrand> = t.brand(
  t.string,
  (str: string): str is t.Branded<string, NotEmptyStringBrand> => str.trim().length > 0,
  'isNotEmptyString'
);

export type NotEmptyString = t.TypeOf<typeof isNotEmptyString>;

export type NotEmptyStringBrand = {
  readonly isNotEmptyString: unique symbol;
};
