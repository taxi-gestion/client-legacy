import { type as ioType } from 'io-ts';
import { isPositive } from '../rules/isPositive.rule';

// eslint-disable-next-line @typescript-eslint/typedef
export const journeyEstimateRules = ioType(
  {
    durationInSeconds: isPositive,
    distanceInMeters: isPositive
  },
  'journeyEstimateRules'
);
