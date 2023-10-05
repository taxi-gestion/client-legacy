import { MedicalBillingPage } from './medical/medical-billing.page';
import { StandardBillingPage } from './standard/standard-billing.page';

export * from './medical/medical-billing.page';
export * from './standard/standard-billing.page';

// eslint-disable-next-line @typescript-eslint/typedef
export const PAGES = [MedicalBillingPage, StandardBillingPage];
