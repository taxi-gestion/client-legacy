import { scaleForMinutesRelativeToOneHour } from './planning-row.presenter';

describe('planning row presenter', (): void => {
  it('should scale to 75 according to percentage from minutes relative to one hour when width is 300', (): void => {
    const width: number = 300;
    const minutes: number = 15;

    const scaledWidth: number = scaleForMinutesRelativeToOneHour(minutes, width);

    expect(scaledWidth).toBe(75);
  });

  it('should scale to 150 according to percentage from minutes relative to one hour when width is 300', (): void => {
    const width: number = 300;
    const minutes: number = 30;

    const scaledWidth: number = scaleForMinutesRelativeToOneHour(minutes, width);

    expect(scaledWidth).toBe(150);
  });

  it('should scale to 225 according to percentage from minutes relative to one hour when width is 300', (): void => {
    const width: number = 300;
    const minutes: number = 45;

    const scaledWidth: number = scaleForMinutesRelativeToOneHour(minutes, width);

    expect(scaledWidth).toBe(225);
  });

  it('should scale to 25 according to percentage from minutes relative to one hour when width is 50', (): void => {
    const width: number = 50;
    const minutes: number = 30;

    const scaledWidth: number = scaleForMinutesRelativeToOneHour(minutes, width);

    expect(scaledWidth).toBe(25);
  });
});
