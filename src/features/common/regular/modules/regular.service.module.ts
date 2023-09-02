import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegularFieldComponent, RegularResultsDropdownComponent } from '../components';

@NgModule({
  declarations: [RegularFieldComponent, RegularResultsDropdownComponent],
  exports: [RegularFieldComponent],
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegularServiceModule {}
