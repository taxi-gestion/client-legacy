import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormValidationComponentModule } from '../../form-validation/modules';
import { AutocompleteFieldComponent, AutocompleteResultsDropdownComponent } from '../components';

@NgModule({
  declarations: [AutocompleteFieldComponent, AutocompleteResultsDropdownComponent],
  exports: [AutocompleteFieldComponent],
  imports: [CommonModule, ReactiveFormsModule, FormValidationComponentModule]
})
export class AutocompleteComponentModule {}
