import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { RegisterRegularPresentation } from './register-regular.form';
import { Phone, RegularDetails, RegularRegistered } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { PhoneNumberValues } from '../../components/regular/phone-numbers.component';

export const toRegisterRegularSuccessToast = (regular: RegularRegistered): Toast => ({
  content: `Nouveau passager, ${regular.regularRegistered.firstname} ${regular.regularRegistered.lastname} enregistré`,
  status: 'success',
  title: `Un passager a été enregistré`
});

const isEmptyOrWhitespace = (str: string): boolean => str === '' || str.trim() === '';

export const toRegularDetails = (formValues: RegisterRegularPresentation): RegularDetails => ({
  civility: formValues.civility,
  firstname: formValues.firstname,
  lastname: formValues.lastname,
  phones: formValues.phones.length === 0 ? undefined : formValues.phones.map(toPhone),
  home: formValues.homeAddress,
  commentary: isEmptyOrWhitespace(formValues.commentary) ? undefined : formValues.commentary,
  // TODO WIP
  destinations: [],
  subcontractedClient: isEmptyOrWhitespace(formValues.subcontractedClient) ? undefined : formValues.subcontractedClient
});

export const toPhone = (phoneNumberValue: PhoneNumberValues): Phone => ({
  name: phoneNumberValue.phoneName,
  // eslint-disable-next-line id-denylist
  number: phoneNumberValue.phoneNumber
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
