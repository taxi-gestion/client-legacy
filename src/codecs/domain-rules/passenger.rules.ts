import { intersection as ioIntersection, type as ioType, undefined as ioUndefined, union as ioUnion } from 'io-ts';
import { civilityCodec } from '../domain';
import { entityRule } from './entity.rule';
import { isNotEmptyString } from '../rules/isNotEmptyString.rule';
import { phoneRules } from './phone.rules';

// eslint-disable-next-line @typescript-eslint/typedef
export const passengerRules = ioType(
  {
    civility: civilityCodec,
    firstname: ioUnion([isNotEmptyString, ioUndefined]),
    lastname: isNotEmptyString,
    phone: phoneRules,
    comment: ioUnion([isNotEmptyString, ioUndefined])
  },
  'passengerCodec'
);

// eslint-disable-next-line @typescript-eslint/typedef
export const passengerEntityRules = ioIntersection([entityRule, passengerRules], 'passengerEntityCodec');
