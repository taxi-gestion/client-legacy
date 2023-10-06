import { Entity, Scheduled } from '@definitions';
import { groupByNature } from './billing.presenter';

describe('groupByNature', (): void => {
  const fare1: Entity & Scheduled = {
    id: 'plip',
    nature: 'medical'
  } as unknown as Entity & Scheduled;

  const fare2: Entity & Scheduled = {
    id: 'plop',
    nature: 'standard'
  } as unknown as Entity & Scheduled;

  const fare3: Entity & Scheduled = {
    id: 'plup',
    nature: 'medical'
  } as unknown as Entity & Scheduled;

  it.each([
    [
      [fare1, fare2, fare3],
      {
        medical: [fare1, fare3],
        standard: [fare2]
      }
    ]
  ])(
    'group fares by nature',
    (
      fares: (Entity & Scheduled)[],
      expectedResult: { medical: (Entity & Scheduled)[]; standard: (Entity & Scheduled)[] }
    ): void => {
      expect(groupByNature(fares)).toStrictEqual(expectedResult);
    }
  );
});
