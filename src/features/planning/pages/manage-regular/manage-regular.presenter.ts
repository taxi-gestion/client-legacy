import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { Entity, RegularDeleted, RegularDetails, RegularEdited } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { editRegularFormCodec, EditRegularValues } from './edit-regular.form';
import { fold as eitherFold } from 'fp-ts/Either';
import { pipe as fpPipe } from 'fp-ts/function';
import { entityCodec } from '@codecs';
import { passengerIdentity, throwDecodeError, toRegularDetails } from '../../common/regular.presenter';
import { RegularValues } from '@features/common/regular';

export const toEditRegular = (rawFormValues: unknown): Entity & RegularDetails =>
  fpPipe(
    editRegularFormCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('editRegularFormCodec', rawFormValues), toDomain)
  );

export const toDeleteRegular = (rawValue: unknown): Entity =>
  fpPipe(
    entityCodec.decode(rawValue),
    eitherFold(throwDecodeError('entityCodec', rawValue), (entity: Entity): Entity => entity)
  );

export const toDeleteRegularSuccessToast = (regular: RegularDeleted): Toast => ({
  content: `Passager supprimé: ${passengerIdentity(regular.regularDeleted)}`,
  status: 'success',
  title: `Un passager à été supprimé`
});

export const toEditRegularSuccessToast = (regular: RegularEdited): Toast => ({
  content: `Passager modifié: ${passengerIdentity(regular.regularEdited)}`,
  status: 'success',
  title: `Un passager a été modifié`
});

export const toEditRegularPresentation = (regular: Entity & RegularValues): EditRegularValues => ({
  regular,
  civility: regular.civility,
  firstname: regular.firstname,
  lastname: regular.lastname,
  phones: regular.phones,
  homeAddress: regular.homeAddress,
  commentary: regular.commentary,
  destinations: regular.destinations,
  subcontractedClient: regular.subcontractedClient
});

const toDomain = (formValues: EditRegularValues): Entity & RegularDetails => ({
  id: formValues.regular.id,
  ...toRegularDetails(formValues)
});

// TODO Réfléchir à la mutualisation des erreurs communes
export type FormattedEditRegularError = { field?: string; errors: Record<string, unknown> };
export const formatEditRegularError = (error: Error): FormattedEditRegularError =>
  editRegularErrorFormatMap.get(error.name)?.(error) ?? {
    errors: { unknown: true }
  };

const editRegularErrorFormatMap: Map<string, (error: Error) => FormattedEditRegularError> = new Map([
  [
    VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME,
    (error: Error): FormattedEditRegularError => ({
      errors: {
        [VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME]: error
      }
    })
  ]
]);
