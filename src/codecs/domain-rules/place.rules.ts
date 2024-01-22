/* eslint-disable @typescript-eslint/typedef */
import { type as ioType } from 'io-ts';
import { isNotEmptyString } from '../rules/isNotEmptyString.rule';

export const placeRules = ioType(
  {
    context: isNotEmptyString,
    label: isNotEmptyString
  },
  'placeRules'
);
