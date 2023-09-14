import { EstimateJourneyFieldsComponent } from './fares/fields';
import { PlanningComponent } from './planning/planning.component';
import { PlanningRowComponent } from './planning/planning-row/planning-row.component';
import { PlanningSettingsComponent } from './planning/planning-settings/planning-settings.component';
import { FarePlanningSessionComponent } from './fares/fare-planning-session/fare-planning-session.component';
import { FareCardComponent } from './fares/fare-card/fare-card.component';
import { PendingReturnFieldComponent } from './fares/pending-return-field/pending-return-field.component';
import { PendingReturnResultsDropdownComponent } from './fares/pending-return-results-dropdown/pending-return-results-dropdown.component';
import { PhonesComponent } from './regular/phones/phones.component';
import { DestinationsComponent } from './regular/destinations/destinations.component';
import { FormControlErrorsComponent } from './errors/form-control-errors/form-control-errors.component';

export * from './fares/fields';
export * from './regular/destinations';

// eslint-disable-next-line @typescript-eslint/typedef
export const COMPONENTS = [
  PlanningComponent,
  PlanningRowComponent,
  PlanningSettingsComponent,
  FarePlanningSessionComponent,
  FareCardComponent,
  PendingReturnFieldComponent,
  PendingReturnResultsDropdownComponent,
  EstimateJourneyFieldsComponent,
  PhonesComponent,
  DestinationsComponent,
  FormControlErrorsComponent
];
