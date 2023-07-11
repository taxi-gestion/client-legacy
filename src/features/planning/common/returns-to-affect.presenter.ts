import { ReturnToAffectForDatePresentation } from '@features/planning/common/returns-to-affect.presentation';
import { ReturnToAffectForDate } from '@features/planning';

export const toReturnsToAffectForDatePresentation = (fares: ReturnToAffectForDate[]): ReturnToAffectForDatePresentation[] =>
  fares.map(toReturnToAffectForDatePresentation);

export const toReturnToAffectForDatePresentation = (fare: ReturnToAffectForDate): ReturnToAffectForDatePresentation => ({
  id: fare.id,
  client: fare.client,
  departure: fare.departure,
  destination: fare.destination,
  kind: fare.kind,
  nature: fare.nature,
  phone: fare.phone,
  planning: fare.planning,
  status: 'return-to-affect',
  time: fare.time
});
