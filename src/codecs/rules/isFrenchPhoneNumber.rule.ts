import * as t from 'io-ts';
import { BrandC, StringC } from 'io-ts';

export const isFrenchPhoneNumber: BrandC<StringC, FrenchPhoneNumberBrand> = t.brand(
  t.string,
  (phoneNumber: string): phoneNumber is t.Branded<string, FrenchPhoneNumberBrand> => isFrenchPhone(phoneNumber),
  'isFrenchPhoneNumber'
);

const formatPhone = (phone?: string): string => phone?.replace('(0)', '').replace(/[^+\d]/gu, '') ?? '';

const isFrenchPhone = (phone?: string): boolean => /^(?:(?:\+|00)33|0)[1-9]\d{8}$/gu.test(formatPhone(phone));

type FrenchPhoneNumberBrand = {
  readonly isFrenchPhoneNumber: unique symbol;
};
