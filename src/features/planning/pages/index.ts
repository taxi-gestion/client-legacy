import { AffectReturnPage } from './affect-return/affect-return.page';
import { DriverAgendaPage } from './driver-agenda/driver-agenda.page';
import { ManagerDriverChoicePage } from './manager-driver-choice/manager-driver-choice.page';
import { MissingAdminConfigurationPage } from './missing-admin-configuration/missing-admin-configuration.page';
import { ScheduleFarePage } from './schedule-fare/schedule-fare.page';

export * from './affect-return/affect-return.page';
export * from './driver-agenda/driver-agenda.page';
export * from './missing-admin-configuration/missing-admin-configuration.page';
export * from './manager-driver-choice/manager-driver-choice.page';
export * from './schedule-fare/schedule-fare.page';

// eslint-disable-next-line @typescript-eslint/typedef
export const PAGES = [
  AffectReturnPage,
  DriverAgendaPage,
  MissingAdminConfigurationPage,
  ManagerDriverChoicePage,
  ScheduleFarePage
];
