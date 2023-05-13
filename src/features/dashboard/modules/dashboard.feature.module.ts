import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PAGES } from '../pages';
import { DashboardFeatureRoutingModule } from './dashboard.feature-routing.module';

@NgModule({
  declarations: [...PAGES],
  imports: [CommonModule, DashboardFeatureRoutingModule]
})
export class DashboardFeatureModule {}
