import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AutocompleteComponentModule } from '@features/common/autocomplete';
import { DriverFieldComponent } from '../components';

@NgModule({
  declarations: [DriverFieldComponent],
  exports: [DriverFieldComponent],
  imports: [CommonModule, ReactiveFormsModule, AutocompleteComponentModule]
})
export class DriverComponentModule {}
