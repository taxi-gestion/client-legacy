import { describe, it, expect } from 'vitest';
import { getNextOccurrences } from './predict-recurrence.presenter';

describe('predict recurrence', (): void => {
  describe('get dates from unix CRON string', (): void => {
    it.each([
      ['invalid cron string', new Date('2023-07-13T00:00:00Z'), 3, []],
      [
        '0 0 * * 2',
        new Date('2023-07-13T00:00:00'),
        3,
        [new Date('2023-07-18T00:00:00'), new Date('2023-07-25T00:00:00'), new Date('2023-08-01T00:00:00')]
      ],
      [
        '0 14 * * 5#1',
        new Date('2023-07-13T00:00:00'),
        3,
        [new Date('2023-08-04T14:00:00'), new Date('2023-09-01T14:00:00'), new Date('2023-10-06T14:00:00')]
      ]
    ])(
      'returns correct dates for cron string "%s"',
      (cronString: string, startDate: Date, maxOccurrences: number, expectedDates: Date[]): void => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(getNextOccurrences(cronString, startDate, maxOccurrences)).toStrictEqual(expectedDates);
      }
    );
  });
});
