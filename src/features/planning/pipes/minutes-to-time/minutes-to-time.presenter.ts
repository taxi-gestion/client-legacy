const minutesToHours = (minutes: number): number => Math.floor(minutes / 60);

const formatHours = (hours: number): string => (hours < 10 ? `0${hours}` : `${hours}`);

const remainingMinutes = (minutes: number): number => minutes % 60;

const formatMinutes = (minutes: number): string => (minutes < 10 ? `0${minutes}` : `${minutes}`);

export const minutesToTime = (minutes: number): string =>
  `${formatHours(minutesToHours(minutes))}:${formatMinutes(remainingMinutes(minutes))}`;
