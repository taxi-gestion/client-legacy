import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarUiModule } from '../../../root/components';
import { PAGES } from '../pages';
import { FormValidationComponentModule } from '../../common/form-validation/modules';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '../../common/form-validation/providers/error-messages.token';
import { PhoneComponentModule } from '@features/common/phone';
import { RecurrenceServiceModule } from '@features/common/recurrence';
import { DestinationComponentModule } from '@features/common/destination';
import { RegularComponentModule } from '@features/common/regular';
import { PlaceComponentModule } from '@features/common/place';
import { LoadUiModule } from '@features/common/load';
import { FareFeatureRoutingModule } from './fare.feature-routing.module';
import { FARE_FORM_CONTROL_ERROR_MESSAGES } from '../errors/form-errors-messages.token';
import { LAYOUTS } from '../layouts';
import { COMPONENTS, PendingReturnFieldComponent, ScheduledFareFieldComponent } from '../components';
import { AutocompleteComponentModule } from '@features/common/autocomplete';
import { DriverComponentModule } from '@features/common/driver';
import { DateModule } from '@features/common/date';
import { JourneyComponentModule } from '@features/common/journey';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...LAYOUTS, ...PAGES, ...COMPONENTS],
  exports: [ScheduledFareFieldComponent, PendingReturnFieldComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadUiModule,
    PlaceComponentModule,
    FareFeatureRoutingModule,
    RecurrenceServiceModule,
    RegularComponentModule,
    NavbarUiModule,
    FormValidationComponentModule,
    PhoneComponentModule,
    DestinationComponentModule,
    RegularComponentModule,
    AutocompleteComponentModule,
    DriverComponentModule,
    DateModule,
    JourneyComponentModule
  ],
  providers: [
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: FARE_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class FareFeatureModule {}
