/* eslint-disable @typescript-eslint/typedef */
import { type as ioType, union as ioUnion, undefined as ioUndefined } from 'io-ts';
import { isNotEmptyString } from '../rules/isNotEmptyString.rule';
import { isLocation } from '../rules/isLocation.rule';

export const placeRules = ioType(
  {
    context: isNotEmptyString,
    label: isNotEmptyString,
    location: ioUnion([isLocation, ioUndefined])
  },
  'placeRules'
);
