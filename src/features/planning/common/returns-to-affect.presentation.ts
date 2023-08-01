import { PlacePresentation } from '@features/common/place';

export type ReturnToAffectForDatePresentation = {
  id: string;
  client: string;
  departure: PlacePresentation;
  destination: PlacePresentation;
  planning: string | undefined;
  kind: string;
  nature: string;
  phone: string;
  status: string;
  time: string | undefined;
};
