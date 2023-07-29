import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PlaceFieldComponent, PlaceResultsDropdownComponent } from '../components';

@NgModule({
  declarations: [PlaceFieldComponent, PlaceResultsDropdownComponent],
  exports: [PlaceFieldComponent],
  imports: [CommonModule, ReactiveFormsModule]
})
export class PlaceFeatureModule {}
