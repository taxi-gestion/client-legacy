import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { RegisterRegularPresentation } from './register-regular.form';
import { Entity, Regular } from '@domain';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';

export const toRegisterRegularSuccessToast = (payload: { rows: (Entity & Regular)[] }[]): Toast => {
  // TODO Adapt & type api response to return right payload
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const regular: Entity & Regular = payload[0]!.rows[0]!;
  return {
    content: `Nouveau passager, ${regular.firstname} ${regular.lastname} - ${regular.phone} enregistré`,
    status: 'success',
    title: `Un passager a été enregistré`
  };
};
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
