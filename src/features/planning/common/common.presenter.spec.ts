import { formatDateDDMMYYYY } from './fares.presenter';

describe('daily presenter', (): void => {
  it('should format date 2019-03-05 to 05/03/2019', (): void => {
    const date: Date = new Date('2019-03-05');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const formattedDate: string = formatDateDDMMYYYY(date);

    expect(formattedDate).toBe('05/03/2019');
  });
});
