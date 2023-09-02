import { intersection as ioIntersection, string as ioString, type as ioType, Type } from 'io-ts';
import { Entity, Regular } from '../../definitions';
import { entityCodec } from './traits.codecs';

export const regularPassengerCodec: Type<Regular> = ioType({
  firstname: ioString,
  lastname: ioString,
  phone: ioString
});

export const regularPassengerEntityCodec: Type<Entity & Regular> = ioIntersection([entityCodec, regularPassengerCodec]);
