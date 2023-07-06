export type FareToScheduleForDatePresentation = {
  client: string;
  creator: string;
  departure: string;
  destination: string;
  distance: string;
  planning: string | undefined;
  duration: number;
  kind: string;
  nature: string;
  phone: string;
  status: string;
  time: string | undefined;
};

export type FaresToScheduleForDatePresentation = FareToScheduleForDatePresentation[];
