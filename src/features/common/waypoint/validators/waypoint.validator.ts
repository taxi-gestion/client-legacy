import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { WaypointValues } from '../definitions/waypoint.definition';
import { isValidPlaceValues } from '@features/common/place';

export const selectedWaypointValidator =
  (selectedWaypoint: WaypointValues | undefined): ValidatorFn =>
  (): ValidationErrors | null =>
    isValidWaypointValues(selectedWaypoint) ? null : { invalidWaypoint: { value: selectedWaypoint } };

export const waypointValidator = (control: AbstractControl): ValidationErrors | null =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
  isValidWaypointValues(control.value) ? null : { invalidWaypoint: { value: control.value } };

const isValidWaypointValues = (waypoint: WaypointValues | undefined): boolean =>
  waypoint === undefined ? false : isWaypointValue(waypoint);

const isWaypointValue = (waypoint: WaypointValues): boolean =>
  isValidPlaceValues(waypoint.place) && waypoint.waypointName !== '';
