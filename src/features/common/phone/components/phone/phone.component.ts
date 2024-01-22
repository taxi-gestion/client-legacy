import { Component, Input } from '@angular/core';
import { PhoneFields } from '../fields.form';
import { AbstractControl, FormGroup } from '@angular/forms';
import { bootstrapValidationClasses, BootstrapValidationClasses } from '../../../form-validation';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html'
})
export class PhoneComponent {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Input({ required: true }) public parentForm!: FormGroup<PhoneFields>;
}
