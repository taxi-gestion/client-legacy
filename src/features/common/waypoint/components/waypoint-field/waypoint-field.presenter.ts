import { WaypointValues } from '../../definitions/waypoint.definition';

export const filterOnWaypointValuesProperties =
  (searchTerm: string) =>
  (combinedResults: WaypointValues[]): WaypointValues[] =>
    combinedResults.filter((waypointValue: WaypointValues): boolean =>
      `${waypointValue.waypointName}${waypointValue.place.context}${waypointValue.place.label}`.includes(searchTerm)
    );
