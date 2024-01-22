import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BootstrapValidationClasses, bootstrapValidationClasses } from '@features/common/form-validation';
import { WaypointFields } from '../fields.form';

@Component({
  selector: 'app-waypoint',
  templateUrl: './waypoint.component.html'
})
export class WaypointComponent {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Input({ required: true }) public parentForm!: FormGroup<WaypointFields>;
}
