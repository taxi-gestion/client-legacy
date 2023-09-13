import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { RegularDetails, RegularRegistered } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { pipe as fpPipe } from 'fp-ts/function';
import { registerRegularFormCodec } from './register-regular.form';
import { fold as eitherFold } from 'fp-ts/Either';
import { regularIdentity, throwDecodeError, toRegularDetails } from '../../common/regular.presenter';

export const toRegisterRegular = (rawFormValues: unknown): RegularDetails =>
  fpPipe(
    registerRegularFormCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('registerRegularFormCodec', rawFormValues), toRegularDetails)
  );

export const toRegisterRegularSuccessToast = (regular: RegularRegistered): Toast => ({
  content: `Nouveau passager enregistré: ${regularIdentity(regular.regularRegistered)}`,
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
