import { Civility } from '@definitions';
import { PlaceValues } from '@features/common/place';
import { DestinationValues } from '@features/common/destination';
import { PhoneValues } from '@features/common/phone';

export type RegularValues = {
  civility: Civility;
  lastname: string;
  firstname: string | undefined;
  homeAddress: PlaceValues | undefined;
  commentary: string | undefined;
  subcontractedClient: string | undefined;
} & {
  destinations: DestinationValues[] | undefined;
} & {
  phones: PhoneValues[] | undefined;
};
