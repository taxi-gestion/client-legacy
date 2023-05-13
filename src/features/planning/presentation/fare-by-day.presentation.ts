export type FareStatus = 'finished' | 'subcontracted';

export type FareByDayPresentation = {
  id: string;
  date: string;
  distance: string;
  duration: string;
  status: FareStatus;
  startTime: string;
};
