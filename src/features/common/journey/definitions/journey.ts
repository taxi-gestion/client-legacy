import { Place } from '@features/common/place';

export type Journey = {
  origin: Place;
  destination: Place;

  departureTime: string;
};

export type JourneyEstimate = {
  durationInSeconds: number;
  distanceInMeters: number;
};
