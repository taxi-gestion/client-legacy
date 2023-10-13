import { keyof as ioKeyOf, string as ioString, type as ioType, Type, undefined as ioUndefined, union as ioUnion } from 'io-ts';
import { WaypointValues } from '../definitions';
import { placeValuesCodec } from '@features/common/place';

export const waypointValuesCodec: Type<WaypointValues> = ioType({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  setKind: ioKeyOf({ none: null, 'one-way': null, 'two-way': null }),
  setNature: ioKeyOf({ none: null, medical: null, standard: null }),
  place: placeValuesCodec,
  comment: ioUnion([ioString, ioUndefined]),
  waypointName: ioString
});
