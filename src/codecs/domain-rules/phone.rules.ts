/* eslint-disable @typescript-eslint/typedef */
import { type as ioType, literal as ioLitteral, union as ioUnion } from 'io-ts';
import { isFrenchPhoneNumber } from '../rules/isFrenchPhoneNumber.rule';
import { isNotEmptyString } from '../rules/isNotEmptyString.rule';

export const phoneRules = ioUnion(
  [
    ioType({
      number: isFrenchPhoneNumber,
      type: isNotEmptyString
    }),
    ioType({
      number: ioLitteral(''),
      type: ioLitteral('')
    })
  ],
  'phoneRules'
);
