import { minutesToTime } from './minutes-to-time.presenter';

describe('minutes to time presenter', (): void => {
  it('should get 00:30 for 30 minutes', (): void => {
    const minutes: number = 30;
    const time: string = minutesToTime(minutes);

    expect(time).toBe('00:30');
  });

  it('should get 07:30 for 450 minutes', (): void => {
    const minutes: number = 450;
    const time: string = minutesToTime(minutes);

    expect(time).toBe('07:30');
  });

  it('should get 12:00 for 450 minutes', (): void => {
    const minutes: number = 720;
    const time: string = minutesToTime(minutes);

    expect(time).toBe('12:00');
  });
});
