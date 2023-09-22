import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarUiModule } from '../../../root/components';
import { COMPONENTS } from '../components';
import { CanActivatePlanningRedirectGuard } from '../guards';
import { LAYOUTS } from '../layouts';
import { PAGES } from '../pages';
import { PIPES } from '../pipes';
import { PlanningFeatureRoutingModule } from './planning.feature-routing.module';
import { DIRECTIVES } from '../directives';
import { FormValidationComponentModule } from '../../common/form-validation/modules';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '../../common/form-validation/providers/error-messages.token';
import { PLANNING_FORM_CONTROL_ERROR_MESSAGES } from '../errors/form-errors-messages.token';
import { PhoneComponentModule } from '@features/common/phone';
import { RecurrenceServiceModule } from '@features/common/recurrence';
import { DriverComponentModule } from '@features/common/driver';
import { JourneyQueriesModule } from '@features/common/journey';
import { DestinationComponentModule } from '@features/common/destination';
import { RegularComponentModule } from '@features/common/regular';
import { PlaceComponentModule } from '@features/common/place';
import { LoadUiModule } from '@features/common/load';
import { FareComponentModule } from '@features/common/fare';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...LAYOUTS, ...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES],
  exports: [...DIRECTIVES],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadUiModule,
    PlaceComponentModule,
    JourneyQueriesModule,
    PlanningFeatureRoutingModule,
    RecurrenceServiceModule,
    DriverComponentModule,
    RegularComponentModule,
    NavbarUiModule,
    FormValidationComponentModule,
    PhoneComponentModule,
    DestinationComponentModule,
    RegularComponentModule,
    FareComponentModule
  ],
  providers: [
    CanActivatePlanningRedirectGuard,
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: PLANNING_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class PlanningFeatureModule {}
