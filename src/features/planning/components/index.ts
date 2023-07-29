import { PlanningComponent } from './planning/planning.component';
import { PlanningRowComponent } from './planning/planning-row/planning-row.component';
import { PlanningSettingsComponent } from './planning/planning-settings/planning-settings.component';
import { ScheduleFareComponent } from './fares/schedule-fare/schedule-fare.component';
import { FarePlanningSessionComponent } from './fares/fare-planning-session/fare-planning-session.component';
import { FareCardComponent } from './fares/fare-card/fare-card.component';
import { ReturnsToAffectListComponent } from './fares/returns-to-schedule-list/returns-to-affect-list.component';
import { AffectReturnComponent } from './fares/affect-return/affect-return.component';

// eslint-disable-next-line @typescript-eslint/typedef
export const COMPONENTS = [
  PlanningComponent,
  PlanningRowComponent,
  PlanningSettingsComponent,
  FarePlanningSessionComponent,
  FareCardComponent,
  ScheduleFareComponent,
  ReturnsToAffectListComponent,
  AffectReturnComponent
];
