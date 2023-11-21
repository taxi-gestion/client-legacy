import { array as ioArray, type as ioType, undefined as ioUndefined, union as ioUnion } from 'io-ts';
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
