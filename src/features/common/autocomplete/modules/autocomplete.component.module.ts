import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormValidationComponentModule } from '../../form-validation/modules';
import { AutocompleteFieldComponent, AutocompleteResultsDropdownComponent } from '../components';
import { DateModule } from '../../date';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [AutocompleteFieldComponent, AutocompleteResultsDropdownComponent],
  exports: [AutocompleteFieldComponent],
  imports: [CommonModule, ReactiveFormsModule, FormValidationComponentModule, DateModule, RouterLink]
})
export class AutocompleteComponentModule {}
