import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarUiModule } from '../../../root/components';
import { PAGES } from '../pages';
import { FormValidationComponentModule } from '../../common/form-validation/modules';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '../../common/form-validation/providers/error-messages.token';
import { PhoneComponentModule } from '@features/common/phone';
import { RecurrenceServiceModule } from '@features/common/recurrence';
import { PlaceComponentModule } from '@features/common/place';
import { LoadUiModule } from '@features/common/load';
import { RegularFeatureRoutingModule } from './regular.feature-routing.module';
import { REGULAR_FORM_CONTROL_ERROR_MESSAGES } from '../errors/form-errors-messages.token';
import { LAYOUTS } from '../layouts';
import { WaypointModule } from '@features/common/waypoint';
import { COMPONENTS, RegularFieldComponent } from '../components';
import { AutocompleteComponentModule } from '../../common/autocomplete';
import { RegularHistoryScheduledComponent } from '../components/regular-history/regular-history-scheduled.component';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...LAYOUTS, ...PAGES, ...COMPONENTS],
  exports: [RegularFieldComponent, RegularHistoryScheduledComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadUiModule,
    PlaceComponentModule,
    RegularFeatureRoutingModule,
    RecurrenceServiceModule,
    NavbarUiModule,
    FormValidationComponentModule,
    PhoneComponentModule,
    WaypointModule,
    AutocompleteComponentModule
  ],
  providers: [
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: REGULAR_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class RegularFeatureModule {}
