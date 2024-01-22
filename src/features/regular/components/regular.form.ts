import { string as ioString, type as ioType, Type, union as ioUnion } from 'io-ts';
import { WaypointValues, waypointValuesCodec } from '../../common/waypoint';
import { PhoneValues, phoneValuesCodec } from '../../common/phone';
import { Entity } from '../../../definitions';

export type RegularPatchableValues =
  | {
      phone: PhoneValues;
    }
  | {
      waypoint: WaypointValues;
    };
export const regularPatchFormCodec: Type<Entity & RegularPatchableValues> = ioUnion([
  ioType({
    id: ioString,
    phone: phoneValuesCodec
  }),
  ioType({
    id: ioString,
    waypoint: waypointValuesCodec
  })
]);
