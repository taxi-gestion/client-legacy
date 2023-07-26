import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadModule } from '@features/common';
import { COMPONENTS } from '../components';
import { CanActivatePlanningRedirectGuard } from '../guards';
import { PAGES } from '../pages';
import { PIPES } from '../pipes';
import { PlanningFeatureRoutingModule } from './planning.feature-routing.module';
import { PlaceFeatureModule } from '@features/places/modules';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...PAGES, ...COMPONENTS, ...PIPES],
  imports: [LoadModule, CommonModule, PlanningFeatureRoutingModule, ReactiveFormsModule, FormsModule, PlaceFeatureModule],
  providers: [CanActivatePlanningRedirectGuard]
})
export class PlanningFeatureModule {}
