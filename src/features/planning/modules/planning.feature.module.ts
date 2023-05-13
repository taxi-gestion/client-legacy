import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { COMPONENTS } from '../components';
import { PAGES } from '../pages';
import { PlanningFeatureRoutingModule } from './planning.feature-routing.module';

@NgModule({
  declarations: [...PAGES, ...COMPONENTS],
  imports: [CommonModule, PlanningFeatureRoutingModule]
})
export class PlanningFeatureModule {}
