import { string as ioString, type as ioType, Type, undefined as ioUndefined, union as ioUnion } from 'io-ts';
import { Waypoint } from '../../definitions';
import { placeCodec } from '../common';
import { kindCodec, natureCodec } from './base.codecs';

export const waypointCodec: Type<Waypoint> = ioType(
  {
    kind: ioUnion([kindCodec, ioUndefined]),
    nature: ioUnion([natureCodec, ioUndefined]),
    place: placeCodec,
    comment: ioUnion([ioString, ioUndefined]),
    name: ioString
  },
  'waypointCodec'
);
