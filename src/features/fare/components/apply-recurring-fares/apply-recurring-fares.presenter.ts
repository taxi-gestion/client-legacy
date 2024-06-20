import { RecurringApplied } from '../../../../definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';

export const toRecurringAppliedSuccessToast = (fares: RecurringApplied[]): Toast => ({
  content: `${fares.length} règles de récurrences on été appliquées`,
  status: 'success',
  title: 'Règles de récurrence appliquées'
});
