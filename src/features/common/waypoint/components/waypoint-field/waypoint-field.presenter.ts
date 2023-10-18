import { WaypointValues } from '@features/common/waypoint';

export const filterOnWaypointValuesProperties =
  (searchTerm: string) =>
  (combinedResults: WaypointValues[]): WaypointValues[] =>
    combinedResults.filter((waypointValue: WaypointValues): boolean =>
      `${waypointValue.waypointName}${waypointValue.place.context}${waypointValue.place.label}`.includes(searchTerm)
    );
