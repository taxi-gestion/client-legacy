import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EstimateJourneyFields2Component } from '../components';

export * from '../components/estimate-journey-fields.form';

@NgModule({
  declarations: [EstimateJourneyFields2Component],
  exports: [EstimateJourneyFields2Component],
  imports: [CommonModule, ReactiveFormsModule]
})
export class JourneyComponentModule {}
