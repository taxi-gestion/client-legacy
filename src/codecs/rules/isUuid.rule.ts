import * as t from 'io-ts';
import { BrandC, StringC } from 'io-ts';

export const isUUIDString: BrandC<StringC, UUIDBrand> = t.brand(
  t.string,
  (uuid: string): uuid is t.Branded<string, UUIDBrand> => matchUUID(uuid),
  'isUUID'
);

export type UUID = t.TypeOf<typeof isUUIDString>;

const matchUUID = (time: string): boolean =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/gu.test(time);

export type UUIDBrand = {
  readonly isUUID: unique symbol;
};
