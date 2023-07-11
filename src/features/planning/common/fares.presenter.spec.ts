import { toStandardDateFormat } from './unit-convertion';

describe('daily presenter', (): void => {
  it('should format date 2019-03-05 to string representation 2019-03-05', (): void => {
    const date: Date = new Date('2019-03-05');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const formattedDate: string = toStandardDateFormat(date);

    expect(formattedDate).toBe('2019-03-05');
  });
});
