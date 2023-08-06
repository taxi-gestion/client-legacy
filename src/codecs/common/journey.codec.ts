import { Type, type as ioType, string as ioString, number as ioNumber } from 'io-ts';
import { placeCodec } from './place.codec';
import { Journey, JourneyEstimate } from '@domain';

export const journeyCodec: Type<Journey> = ioType({
  origin: placeCodec,
  destination: placeCodec,
  departureTime: ioString
});

export const journeyEstimateCodec: Type<JourneyEstimate> = ioType({
  distanceInMeters: ioNumber,
  durationInSeconds: ioNumber
});
