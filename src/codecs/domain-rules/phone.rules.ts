/* eslint-disable @typescript-eslint/typedef */
import { type as ioType } from 'io-ts';
import { isFrenchPhoneNumber } from '../rules/isFrenchPhoneNumber.rule';
import { isNotEmptyString } from '../rules/isNotEmptyString.rule';

export const phoneRules = ioType(
  {
    number: isFrenchPhoneNumber,
    type: isNotEmptyString
  },
  'phoneRules'
);
