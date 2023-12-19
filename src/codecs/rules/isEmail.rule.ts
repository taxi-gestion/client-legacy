import * as t from 'io-ts';

export const isEmailString: t.BrandC<t.StringC, EmailBrand> = t.brand(
  t.string,
  (email: string): email is t.Branded<string, EmailBrand> => matchEmail(email),
  'isEmail'
);

export type Email = t.TypeOf<typeof isEmailString>;

const matchEmail = (email: string): boolean => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gu.test(email);

export type EmailBrand = {
  readonly isEmail: unique symbol;
};
