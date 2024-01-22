import {
  array as ioArray,
  intersection as ioIntersection,
  string as ioString,
  type as ioType,
  Type,
  undefined as ioUndefined,
  union as ioUnion
} from 'io-ts';
import { Entity, Regular, RegularPatchableProperties } from '../../definitions';
import { civilityCodec, entityCodec, phoneCodec } from './traits.codecs';
import { waypointCodec } from './waypoint.codec';

export const regularCodec: Type<Regular> = ioType(
  {
    civility: civilityCodec,
    firstname: ioUnion([ioString, ioUndefined]),
    lastname: ioString,
    phones: ioUnion([ioArray(phoneCodec), ioUndefined]),
    waypoints: ioUnion([ioArray(waypointCodec), ioUndefined]),
    comment: ioUnion([ioString, ioUndefined]),
    subcontractedClient: ioUnion([ioString, ioUndefined])
  },
  'regularCodec'
);

export const regularPatchablePropertiesCodec: Type<Entity & RegularPatchableProperties> = ioUnion(
  [
    ioType({
      id: ioString,
      phones: ioUnion([ioArray(phoneCodec), ioUndefined])
    }),
    ioType({
      id: ioString,
      waypoints: ioUnion([ioArray(waypointCodec), ioUndefined])
    })
  ],
  'RegularPatchableProperties'
);

export const regularEntityCodec: Type<Entity & Regular> = ioIntersection([entityCodec, regularCodec], 'regularEntityCodec');
export const regularsEntitiesCodec: Type<(Entity & Regular)[]> = ioArray(regularEntityCodec, 'regularsDetailsEntitiesCodec');
