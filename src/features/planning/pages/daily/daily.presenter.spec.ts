import { formatDate } from './daily.presenter';

describe('daily presenter', (): void => {
  it('should format date 2019-03-05 to 05/03/2019', (): void => {
    const date: Date = new Date('2019-03-05');

    const formattedDate = formatDate(date);

    expect(formattedDate).toStrictEqual('05/03/2019');
  });
});
