import { timestampFromDateAndTime } from './schedule-fare.presenter';

describe('timestampFromDateAndTime', (): void => {
  it.each([
    ['2023-08-31T12:00:00.000Z', 1693483200],
    ['2023-08-31T00:00:00.000Z', 1693440000],
    ['2023-08-31T23:59:00.000Z', 1693526340],
    ['2023-01-01T00:00:00.000Z', 1672531200]
  ])('returns correct timestamp for date iso8601 %p', (datetime: string, expectedTimestamp: number): void => {
    const timestamp: number = timestampFromDateAndTime(datetime);
    expect(timestamp).toBe(expectedTimestamp);
  });
});
