import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadModule } from '@features/common';
import { COMPONENTS } from '../components';
import { PAGES } from '../pages';
import { PlanningFeatureRoutingModule } from './planning.feature-routing.module';
import { CanActivatePlanningRedirectGuard } from '../guards/can-activate-planning-redirect.guard';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...PAGES, ...COMPONENTS],
  imports: [LoadModule, CommonModule, PlanningFeatureRoutingModule, ReactiveFormsModule, FormsModule],
  providers: [CanActivatePlanningRedirectGuard]
})
export class PlanningFeatureModule {}
