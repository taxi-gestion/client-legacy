import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DriverFieldComponent, DriverResultsDropdownComponent } from '../components';

@NgModule({
  declarations: [DriverFieldComponent, DriverResultsDropdownComponent],
  exports: [DriverFieldComponent],
  imports: [CommonModule, ReactiveFormsModule]
})
export class DriverServiceModule {}
