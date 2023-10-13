import { DurationDistance, Journey, JourneyEstimate } from '@definitions';
import { pipe as fpipe } from 'fp-ts/function';
import { journeyCodec } from '@codecs';
import { fold as eitherFold } from 'fp-ts/Either';
import { throwDecodeError } from '@features/common/form-validation';
import { metersToKilometers, secondsToMinutes } from '@features/common/presentation';

export const toJourney = (rawFormValues: unknown): Journey =>
  fpipe(
    journeyCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('journeyCodec', rawFormValues), (values: Journey): Journey => values)
  );

export const toDisplayDurationDistance = (estimate: JourneyEstimate): DurationDistance => ({
  duration: secondsToMinutes(estimate.durationInSeconds),
  distance: metersToKilometers(estimate.distanceInMeters)
});
