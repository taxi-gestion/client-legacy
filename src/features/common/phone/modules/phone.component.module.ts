import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormValidationComponentModule } from '../../form-validation';
import { AutocompleteComponentModule } from '../../autocomplete';
import { PhoneComponent, PhoneFieldComponent, PhonesComponent } from '../components';

@NgModule({
  declarations: [PhoneFieldComponent, PhonesComponent, PhoneComponent],
  exports: [PhoneFieldComponent, PhonesComponent, PhoneComponent],
  imports: [CommonModule, ReactiveFormsModule, FormValidationComponentModule, AutocompleteComponentModule]
})
export class PhoneComponentModule {}
