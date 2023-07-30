import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientFieldComponent, ClientResultsDropdownComponent } from '../components';

@NgModule({
  declarations: [ClientFieldComponent, ClientResultsDropdownComponent],
  exports: [ClientFieldComponent],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ClientFeatureModule {}
