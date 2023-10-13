import { string as ioString, type as ioType, Type, undefined as ioUndefined, union as ioUnion, keyof as ioKeyOf } from 'io-ts';
import { Kind, Nature, Waypoint } from '../../definitions';
import { placeCodec } from '../common';

// eslint-disable-next-line @typescript-eslint/naming-convention
const kindCodec: Type<Kind> = ioKeyOf({ 'one-way': null, 'two-way': null });
const natureCodec: Type<Nature> = ioKeyOf({ medical: null, standard: null });

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
