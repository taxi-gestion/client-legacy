import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PassengerFieldComponent, PassengerResultsDropdownComponent } from '../components';

@NgModule({
  declarations: [PassengerFieldComponent, PassengerResultsDropdownComponent],
  exports: [PassengerFieldComponent],
  imports: [CommonModule, ReactiveFormsModule]
})
export class PassengerServiceModule {}
