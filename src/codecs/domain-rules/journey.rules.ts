import { type as ioType } from 'io-ts';
import { placeRules } from './place.rules';
import { isDateISO8601String } from '../rules/isDateISO8601.rule';

// eslint-disable-next-line @typescript-eslint/typedef
export const journeyRules = ioType(
  {
    origin: placeRules,
    destination: placeRules,
    departureTime: isDateISO8601String
  },
  'journeyRules'
);
