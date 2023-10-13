import { Civility } from '@definitions';
import { WaypointValues } from '@features/common/waypoint';
import { PhoneValues } from '@features/common/phone';

export type RegularValues = {
  civility: Civility;
  lastname: string;
  firstname: string | undefined;
  comment: string | undefined;
  subcontractedClient: string | undefined;
} & {
  phones: PhoneValues[] | undefined;
} & {
  waypoints: WaypointValues[] | undefined;
};
