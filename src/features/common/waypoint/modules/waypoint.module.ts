import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormValidationComponentModule } from '@features/common/form-validation';
import { WaypointFieldComponent, WaypointsComponent } from '../components';
import { PlaceComponentModule } from '@features/common/place';
import { AutocompleteComponentModule } from '@features/common/autocomplete';
import { WaypointComponent } from '../components/waypoint';

@NgModule({
  declarations: [WaypointsComponent, WaypointFieldComponent, WaypointComponent],
  exports: [WaypointsComponent, WaypointFieldComponent, WaypointComponent],
  imports: [CommonModule, ReactiveFormsModule, FormValidationComponentModule, AutocompleteComponentModule, PlaceComponentModule]
})
export class WaypointModule {}
