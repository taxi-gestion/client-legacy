import { string as ioString, type as ioType, Type } from 'io-ts';
import { Entity } from '../../../../definitions';

export type ToSubcontractValues = {
  subcontractor: string;
};

export const subcontractFareFormCodec: Type<Entity & ToSubcontractValues> = ioType({
  id: ioString,
  subcontractor: ioString
});
