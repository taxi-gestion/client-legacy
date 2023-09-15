import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DriverFieldComponent, DriverResultsDropdownComponent } from '../components';
import { FormValidationComponentModule } from '../../form-validation/modules';

@NgModule({
  declarations: [DriverFieldComponent, DriverResultsDropdownComponent],
  exports: [DriverFieldComponent],
  imports: [CommonModule, ReactiveFormsModule, FormValidationComponentModule]
})
export class DriverComponentModule {}
