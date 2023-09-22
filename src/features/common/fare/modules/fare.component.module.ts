import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormValidationComponentModule } from '../../form-validation';
import { AutocompleteComponentModule } from '../../autocomplete';
import { ScheduledFareFieldComponent } from '../components/scheduled-scheduled-fare-field/scheduled-fare-field.component';

@NgModule({
  declarations: [ScheduledFareFieldComponent],
  exports: [ScheduledFareFieldComponent],
  imports: [CommonModule, ReactiveFormsModule, FormValidationComponentModule, AutocompleteComponentModule]
})
export class FareComponentModule {}
