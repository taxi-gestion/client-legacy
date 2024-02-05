import { Subcontracted } from '../../../../definitions';
import { toTime } from '../../../common/presentation';

export type SubcontractedPresentation = Subcontracted & {
  departureTime: string;
};

export const toSubcontractedPresentation = (fares: Subcontracted[]): SubcontractedPresentation[] => fares.map(toPresentation);

const toPresentation = (fare: Subcontracted): SubcontractedPresentation => ({
  ...fare,
  departureTime: toTime(fare.datetime)
});
