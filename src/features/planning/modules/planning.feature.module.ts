import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadUiModule } from '@features/common';
import { NavbarUiModule } from '../../../root/components';
import { COMPONENTS } from '../components';
import { CanActivatePlanningRedirectGuard } from '../guards';
import { LAYOUTS } from '../layouts';
import { PAGES } from '../pages';
import { PIPES } from '../pipes';
import { PlanningFeatureRoutingModule } from './planning.feature-routing.module';
import { PlaceComponentModule } from '@features/common/place';
import { RecurrenceServiceModule } from '@features/common/recurrence';
import { UserServiceModule } from '@features/common/user';
import { JourneyQueriesModule } from '@features/common/journey';
import { PassengerServiceModule } from '../../common/passenger';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...LAYOUTS, ...PAGES, ...COMPONENTS, ...PIPES],
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
    UserServiceModule,
    NavbarUiModule
  ],
  providers: [CanActivatePlanningRedirectGuard]
})
export class PlanningFeatureModule {}
