import { Entity, Subcontracted } from '../../../../definitions';
import { toTime } from '../../../common/presentation';

export type SubcontractedPresentation = Entity &
  Subcontracted & {
    departureTime: string;
  };

export const toSubcontractedPresentation = (fares: (Entity & Subcontracted)[]): SubcontractedPresentation[] =>
  fares.map(toPresentation);

const toPresentation = (fare: Entity & Subcontracted): SubcontractedPresentation => ({
  ...fare,
  departureTime: toTime(fare.datetime)
});
