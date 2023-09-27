import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormValidationComponentModule } from '../../form-validation';
import { AutocompleteComponentModule } from '../../autocomplete';
import { PendingReturnFieldComponent, ScheduledFareFieldComponent } from '../components';

@NgModule({
  declarations: [ScheduledFareFieldComponent, PendingReturnFieldComponent],
  exports: [ScheduledFareFieldComponent, PendingReturnFieldComponent],
  imports: [CommonModule, ReactiveFormsModule, FormValidationComponentModule, AutocompleteComponentModule]
})
export class FareComponentModule {}
