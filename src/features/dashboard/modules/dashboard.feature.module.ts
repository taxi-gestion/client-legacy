import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PAGES } from '../pages';
import { DashboardFeatureRoutingModule } from './dashboard.feature-routing.module';
import { RedirectUsersByGroupGuard } from '../guards/redirect-users-by-group.guard';

@NgModule({
  declarations: [...PAGES],
  imports: [CommonModule, DashboardFeatureRoutingModule],
  providers: [RedirectUsersByGroupGuard]
})
export class DashboardFeatureModule {}
