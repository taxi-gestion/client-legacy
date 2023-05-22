import { formatDate } from './daily.presenter';

describe('daily presenter', (): void => {
  it('should format date 2019-03-05 to 05/03/2019', (): void => {
    const date: Date = new Date('2019-03-05');

    const formattedDate: string = formatDate(date);

    expect(formattedDate).toBe('05/03/2019');
  });
});
