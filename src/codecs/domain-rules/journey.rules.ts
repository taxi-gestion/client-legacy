import { type as ioType } from 'io-ts';
import { placeRules } from './place.rules';
import { isNotEmptyString } from '../rules';

// eslint-disable-next-line @typescript-eslint/typedef
export const journeyRules = ioType(
  {
    origin: placeRules,
    destination: placeRules,
    departureTime: isNotEmptyString
  },
  'journeyRules'
);
