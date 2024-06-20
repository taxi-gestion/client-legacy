/* eslint-enable */
import { Entity, Scheduled } from '../../../definitions';
import { FaresByNature } from './billing.presenter';

export const groupByNature = (fares: (Entity & Scheduled)[]): FaresByNature =>
  fares.reduce<FaresByNature>(
    (acc: FaresByNature, fare: Entity & Scheduled): FaresByNature => ({
      ...acc,
      [fare.nature]: [...acc[fare.nature], fare]
    }),
    { medical: [], standard: [] }
  );
