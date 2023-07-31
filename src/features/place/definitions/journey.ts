import { Place } from './places';

export type Journey = {
  departure: Place;
  destination: Place;

  // TODO Add datetime
  //departureTime: Date;
};

export type JourneyEstimate = {
  duration: {
    text: string;
    valueInSeconds: number;
  };
  distance: {
    text: string;
    valueInMeters: number;
  };
};
