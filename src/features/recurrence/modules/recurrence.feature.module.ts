import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { COMPONENTS } from '../components';
import { LoadModule } from '@features/common';

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [CommonModule, ReactiveFormsModule, LoadModule]
})
export class RecurrenceFeatureModule {}
