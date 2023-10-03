import { EstimateJourneyFieldsComponent } from './fares/fields';
import { PlanningComponent } from './planning/planning.component';
import { PlanningRowComponent } from './planning/planning-row/planning-row.component';
import { PlanningSettingsComponent } from './planning/planning-settings/planning-settings.component';
import { FarePlanningSessionComponent } from './fares/fare-planning-session/fare-planning-session.component';
import { FareCardComponent } from './fares/fare-card/fare-card.component';
import { PlanningListColumnComponent } from './planning-list/planning-list-column/planning-list-column.component';
import { BillingListColumnComponent } from './billing/billing-list-column/billing-list-column.component';

export * from './fares/fields';

// eslint-disable-next-line @typescript-eslint/typedef
export const COMPONENTS = [
  PlanningComponent,
  PlanningRowComponent,
  PlanningSettingsComponent,
  PlanningListColumnComponent,
  BillingListColumnComponent,
  FarePlanningSessionComponent,
  FareCardComponent,
  EstimateJourneyFieldsComponent
];
