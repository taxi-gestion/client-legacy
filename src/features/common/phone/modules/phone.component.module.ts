import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormValidationComponentModule } from '../../form-validation';
import { AutocompleteComponentModule } from '../../autocomplete';
import { PhoneFieldComponent, PhonesComponent } from '../components';

@NgModule({
  declarations: [PhoneFieldComponent, PhonesComponent],
  exports: [PhoneFieldComponent, PhonesComponent],
  imports: [CommonModule, ReactiveFormsModule, FormValidationComponentModule, AutocompleteComponentModule]
})
export class PhoneComponentModule {}
