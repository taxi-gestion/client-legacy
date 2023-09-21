import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AutocompleteComponentModule } from '@features/common/autocomplete';
import { RegularFieldComponent } from '../components';

@NgModule({
  declarations: [RegularFieldComponent],
  exports: [RegularFieldComponent],
  imports: [CommonModule, ReactiveFormsModule, AutocompleteComponentModule]
})
export class RegularComponentModule {}
