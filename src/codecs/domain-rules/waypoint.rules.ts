import { type as ioType, undefined as ioUndefined, union as ioUnion } from 'io-ts';
import { isNotEmptyString } from '../rules/isNotEmptyString.rule';
import { placeRules } from './place.rules';
import { kindCodec, natureCodec } from '../domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const waypointRules = ioType(
  {
    kind: ioUnion([kindCodec, ioUndefined]),
    nature: ioUnion([natureCodec, ioUndefined]),
    place: placeRules,
    comment: ioUnion([isNotEmptyString, ioUndefined]),
    name: isNotEmptyString
  },
  'waypointRules'
);
