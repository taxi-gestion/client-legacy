import { DailyPage } from './daily/daily.page';
import { DriverAgendaPage } from './driver-agenda/driver-agenda.page';
import { MissingAdminConfigurationPage } from './missing-admin-configuration/missing-admin-configuration.page';
import { ManagerDriverChoicePage } from './manager-driver-choice/manager-driver-choice.page';

export * from './daily/daily.page';

// eslint-disable-next-line @typescript-eslint/typedef
export const PAGES = [DailyPage, DriverAgendaPage, MissingAdminConfigurationPage, ManagerDriverChoicePage];
