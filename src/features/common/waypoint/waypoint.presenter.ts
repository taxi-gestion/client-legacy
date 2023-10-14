import { WaypointValues } from './definitions/waypoint.definition';
import { emptyPlaceValue, toPlace } from '@features/common/place';
import { Waypoint } from '@definitions';

export const emptyWaypointValue: WaypointValues = {
  waypointName: '',
  setNature: 'none',
  setKind: 'none',
  place: emptyPlaceValue,
  comment: undefined
};

export const toWaypointValues = (waypoint: Waypoint): WaypointValues => ({
  waypointName: waypoint.name,
  place: waypoint.place,
  setNature: waypoint.nature === undefined ? 'none' : waypoint.nature,
  setKind: waypoint.kind === undefined ? 'none' : waypoint.kind,
  comment: waypoint.comment
});

export const toWaypointsValues = (waypoints: Waypoint | Waypoint[] | undefined): WaypointValues[] => {
  if (waypoints === undefined) return [];

  return 'name' in waypoints ? [toWaypointValues(waypoints)] : waypoints.map(toWaypointValues);
};

export const toWaypoint = (waypointValues: WaypointValues): Waypoint => ({
  place: toPlace(waypointValues.place),
  comment: waypointValues.comment,
  kind: waypointValues.setKind === 'none' ? undefined : waypointValues.setKind,
  nature: waypointValues.setNature === 'none' ? undefined : waypointValues.setNature,
  name: waypointValues.waypointName
});
