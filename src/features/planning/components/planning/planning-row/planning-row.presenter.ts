const MINUTES_IN_ONE_HOUR: 60 = 60 as const;

export const scaleForMinutesRelativeToOneHour = (minutes: number, scale: number): number =>
  scale / (MINUTES_IN_ONE_HOUR / minutes);
