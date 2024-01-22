import { array as ioArray, string as ioString, type as ioType, undefined as ioUndefined, union as ioUnion } from 'io-ts';
import { civilityCodec } from '../domain';
import { isNotEmptyString } from '../rules';
import { phoneRules } from './phone.rules';
import { waypointRules } from './waypoint.rules';

// eslint-disable-next-line @typescript-eslint/typedef
export const regularRules = ioType(
  {
    civility: civilityCodec,
    firstname: ioUnion([isNotEmptyString, ioUndefined]),
    lastname: isNotEmptyString,
    comment: ioUnion([isNotEmptyString, ioUndefined]),
    subcontractedClient: ioUnion([isNotEmptyString, ioUndefined]),
    phones: ioUnion([ioArray(phoneRules), ioUndefined]),
    waypoints: ioUnion([ioArray(waypointRules), ioUndefined])
  },
  'regularRules'
);

// eslint-disable-next-line @typescript-eslint/typedef
export const regularPatchablePropertiesRules = ioUnion(
  [
    ioType({
      id: ioString,
      phones: ioUnion([ioArray(phoneRules), ioUndefined])
    }),
    ioType({
      id: ioString,
      waypoints: ioUnion([ioArray(waypointRules), ioUndefined])
    })
  ],
  'regularPatchablePropertiesRules'
);
