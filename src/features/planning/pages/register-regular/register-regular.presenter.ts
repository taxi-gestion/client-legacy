import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { RegisterRegularPresentation } from './register-regular.form';
import { Regular, RegularRegistered } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';

export const toRegisterRegularSuccessToast = (regular: RegularRegistered): Toast => ({
  content: `Nouveau passager, ${regular.regularRegistered.firstname} ${regular.regularRegistered.lastname} - ${regular.regularRegistered.phone} enregistré`,
  status: 'success',
  title: `Un passager a été enregistré`
});
export const toRegular = (formValues: RegisterRegularPresentation): Regular => ({
  firstname: formValues.firstname,
  lastname: formValues.lastname,
  phone: formValues.phoneToAutocomplete
});

// TODO Réfléchir à la mutualisation des erreurs communes
export type FormattedRegisterRegularError = { field?: string; errors: Record<string, unknown> };
export const formatRegisterRegularError = (error: Error): FormattedRegisterRegularError =>
  registerRegularErrorFormatMap.get(error.name)?.(error) ?? {
    errors: { unknown: true }
  };

const registerRegularErrorFormatMap: Map<string, (error: Error) => FormattedRegisterRegularError> = new Map([
  [
    VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME,
    (error: Error): FormattedRegisterRegularError => ({
      errors: {
        [VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME]: error
      }
    })
  ]
]);
