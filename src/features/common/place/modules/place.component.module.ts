import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PlaceFieldComponent, PlaceResultsDropdownComponent } from '../components';
import { FormValidationComponentModule } from '../../form-validation/modules';

@NgModule({
  declarations: [PlaceFieldComponent, PlaceResultsDropdownComponent],
  exports: [PlaceFieldComponent],
  imports: [CommonModule, ReactiveFormsModule, FormValidationComponentModule]
})
export class PlaceComponentModule {}
