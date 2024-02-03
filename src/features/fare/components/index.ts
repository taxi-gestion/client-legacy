import { ScheduledFareFieldComponent } from './scheduled-fare-field/scheduled-fare-field.component';
import { PendingReturnFieldComponent } from './pending-return-field/pending-return-field.component';
import { FareFormComponent } from './fare-form/fare-form.component';
import { DeleteFareComponent } from './delete-fare/delete-fare.component';
import { UnassignedFareFieldComponent } from './unassigned-fare-field/unassigned-fare-field.component';
import { AllocateUnassignedComponent } from './allocate-unassigned/allocate-unassigned.component';
import { RecurringFareFormComponent } from './recurring-fare-form/recurring-fare-form.component';
import { ApplyRecurrenceComponent } from './apply-recurring-fares/apply-recurring-fares.component';
import { FaresTabularViewComponent } from './visualisation/fares-tabular-view/fares-tabular-view.component';
import { RegularFaresOverviewComponent } from './visualisation/fares-tabular-overview/regular-fares-overview.component';
import { SubcontractFareComponent } from './subcontract-fare/subcontract-fare.component';

export * from './scheduled-fare-field/scheduled-fare-field.component';
export * from './scheduled-fare-field/scheduled-fare-field.form';
export * from './pending-return-field/pending-return-field.component';
export * from './pending-return-field/pending-return-field.form';

export * from './fare-form/fare-form.component';
export * from './delete-fare/delete-fare.component';
export * from './allocate-unassigned/allocate-unassigned.component';
export * from './recurring-fare-form/recurring-fare-form.component';

// eslint-disable-next-line @typescript-eslint/typedef
export const COMPONENTS = [
  ScheduledFareFieldComponent,
  PendingReturnFieldComponent,
  FareFormComponent,
  DeleteFareComponent,
  AllocateUnassignedComponent,
  UnassignedFareFieldComponent,
  RecurringFareFormComponent,
  ApplyRecurrenceComponent,
  FaresTabularViewComponent,
  RegularFaresOverviewComponent,
  SubcontractFareComponent
];
