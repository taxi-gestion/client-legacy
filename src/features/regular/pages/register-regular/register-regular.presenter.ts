import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '@features/common/form-validation';
import { Regular, RegularRegistered } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { pipe as fpipe } from 'fp-ts/function';
import { registerRegularFormCodec } from './register-regular.form';
import { fold as eitherFold } from 'fp-ts/Either';
import { passengerIdentity, throwDecodeError, toRegular } from '../../common/regular.presenter';

export const toRegisterRegular = (rawFormValues: unknown): Regular =>
  fpipe(
    registerRegularFormCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('registerRegularFormCodec', rawFormValues), toRegular)
  );

export const toRegisterRegularSuccessToast = (regular: RegularRegistered): Toast => ({
  content: `Nouveau passager enregistré: ${passengerIdentity(regular.regularRegistered)}`,
  status: 'success',
  title: `Un passager a été enregistré`
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
