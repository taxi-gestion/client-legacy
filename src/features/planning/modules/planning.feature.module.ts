import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DriverServiceModule,
  JourneyQueriesModule,
  LoadUiModule,
  PassengerServiceModule,
  PlaceComponentModule,
  RecurrenceServiceModule
} from '@features/common';
import { NavbarUiModule } from '../../../root/components';
import { COMPONENTS } from '../components';
import { CanActivatePlanningRedirectGuard } from '../guards';
import { LAYOUTS } from '../layouts';
import { PAGES } from '../pages';
import { PIPES } from '../pipes';
import { PlanningFeatureRoutingModule } from './planning.feature-routing.module';
import { DIRECTIVES } from '../directives';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...LAYOUTS, ...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadUiModule,
    PassengerServiceModule,
    PlaceComponentModule,
    JourneyQueriesModule,
    PlanningFeatureRoutingModule,
    RecurrenceServiceModule,
    DriverServiceModule,
    NavbarUiModule
  ],
  providers: [CanActivatePlanningRedirectGuard]
})
export class PlanningFeatureModule {}
