import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadModule } from '@features/common';
import { COMPONENTS } from '../components';
import { CanActivatePlanningRedirectGuard } from '../guards';
import { PAGES } from '../pages';
import { PIPES } from '../pipes';
import { PlanningFeatureRoutingModule } from './planning.feature-routing.module';
import { PlaceFeatureModule } from '@features/place';
import { RecurrenceFeatureModule } from '@features/recurrence';
import { UserFeatureModule } from '@features/user';
import { ClientFeatureModule } from '../../client';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...PAGES, ...COMPONENTS, ...PIPES],
  imports: [
    CommonModule,
    FormsModule,
    LoadModule,
    ReactiveFormsModule,
    ClientFeatureModule,
    PlaceFeatureModule,
    PlanningFeatureRoutingModule,
    RecurrenceFeatureModule,
    UserFeatureModule
  ],
  providers: [CanActivatePlanningRedirectGuard]
})
export class PlanningFeatureModule {}
