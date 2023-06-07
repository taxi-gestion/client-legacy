import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadModule } from '@features/common';
import { COMPONENTS } from '../components';
import { PAGES } from '../pages';
import { PlanningFeatureRoutingModule } from './planning.feature-routing.module';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...PAGES, ...COMPONENTS],
  imports: [LoadModule, CommonModule, PlanningFeatureRoutingModule, ReactiveFormsModule]
})
export class PlanningFeatureModule {}
