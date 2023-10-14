import { PlaceValues } from '@features/common/place';
import { Kind, Nature } from '@definitions';

export type WaypointValues = {
  waypointName: string;
  place: PlaceValues;
  setKind: Kind | 'none';
  setNature: Nature | 'none';
  comment: string | undefined;
};
