import { number as ioNumber, string as ioString, Type, type as ioType } from 'io-ts';
import { placeCodec } from './place.codec';
import { Journey, JourneyEstimate } from '../../definitions';

export const journeyCodec: Type<Journey> = ioType({
  origin: placeCodec,
  destination: placeCodec,
  departureTime: ioString
});

export const journeyEstimateCodec: Type<JourneyEstimate> = ioType({
  distanceInMeters: ioNumber,
  durationInSeconds: ioNumber
});
