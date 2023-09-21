import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormValidationComponentModule } from '../../form-validation';
import { AutocompleteComponentModule } from '../../autocomplete';
import { PlaceFieldComponent } from '../components/place-field/place-field.component';

@NgModule({
  declarations: [PlaceFieldComponent],
  exports: [PlaceFieldComponent],
  imports: [CommonModule, ReactiveFormsModule, FormValidationComponentModule, AutocompleteComponentModule]
})
export class PlaceComponentModule {}
