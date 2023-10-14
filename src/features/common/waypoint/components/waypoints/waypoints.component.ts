import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BootstrapValidationClasses, bootstrapValidationClasses } from '@features/common/form-validation';
import { placeFieldFormControl } from '../../../place/components/place-field/place-field.form';
import { WaypointValues } from '../../definitions/waypoint.definition';
import { WaypointsArrayElementFields } from './waypoints.form';

@Component({
  selector: 'app-waypoints',
  templateUrl: './waypoints.component.html'
})
export class WaypointsComponent {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Input({ required: true }) public parentArray!: FormArray<FormGroup<WaypointsArrayElementFields>>;

  @Input() public set waypoints(waypoints: (WaypointValues[] | undefined) | null) {
    waypoints != null && this.onWaypointsReceived(waypoints);
  }

  public onWaypointsReceived(waypointValues: WaypointValues[]): void {
    this.parentArray.clear();
    waypointValues.forEach((waypoint: WaypointValues): void => {
      this.addWaypoint(waypoint);
    });
  }

  // eslint-disable-next-line max-lines-per-function
  public createWaypointGroup(waypoint: WaypointValues | undefined): FormGroup<WaypointsArrayElementFields> {
    return new FormGroup<WaypointsArrayElementFields>({
      waypointName: new FormControl<WaypointValues['waypointName']>(waypoint?.waypointName ?? '', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      ...placeFieldFormControl('place', waypoint?.place),
      setKind: new FormControl<WaypointValues['setKind']>(waypoint?.setKind ?? 'none', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      setNature: new FormControl<WaypointValues['setNature']>(waypoint?.setNature ?? 'none', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      comment: new FormControl<WaypointValues['comment']>(waypoint?.comment, {
        nonNullable: true,
        validators: []
      })
    });
  }

  public addWaypoint(waypoint: WaypointValues | undefined): void {
    this.parentArray.push(this.createWaypointGroup(waypoint));
  }

  public removeWaypoint(index: number): void {
    this.parentArray.removeAt(index);
  }
}
