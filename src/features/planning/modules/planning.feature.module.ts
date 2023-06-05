import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { COMPONENTS } from '../components';
import { PAGES } from '../pages';
import { PlanningFeatureRoutingModule } from './planning.feature-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...PAGES, ...COMPONENTS],
  imports: [CommonModule, PlanningFeatureRoutingModule, ReactiveFormsModule]
})
export class PlanningFeatureModule {}
