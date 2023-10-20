import { Civility } from '@definitions';
import { PhoneValues } from '@features/common/phone';

import { WaypointValues } from '@features/common/waypoint';

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
