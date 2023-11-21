import * as t from 'io-ts';

export const isRRULEString: t.BrandC<t.StringC, RRULEBrand> = t.brand(
  t.string,
  (rrule: string): rrule is t.Branded<string, RRULEBrand> => matchRRULE(rrule),
  'isRRULE'
);

export type RRULE = t.TypeOf<typeof isRRULEString>;

const matchRRULE = (rrule: string): boolean =>
  /^DTSTART:\d{8}T\d{6}Z\nRRULE:FREQ=(?:DAILY|WEEKLY|MONTHLY|YEARLY)/gu.test(rrule);

export type RRULEBrand = {
  readonly isRRULE: unique symbol;
};
