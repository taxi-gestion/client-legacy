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
import { RegularFeatureRoutingModule } from './regular.feature-routing.module';
import { REGULAR_FORM_CONTROL_ERROR_MESSAGES } from '../errors/form-errors-messages.token';
import { LAYOUTS } from '../layouts';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...LAYOUTS, ...PAGES],
  exports: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadUiModule,
    PlaceComponentModule,
    RegularFeatureRoutingModule,
    RecurrenceServiceModule,
    RegularComponentModule,
    NavbarUiModule,
    FormValidationComponentModule,
    PhoneComponentModule,
    DestinationComponentModule,
    RegularComponentModule
  ],
  providers: [
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: REGULAR_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class RegularFeatureModule {}
