import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '@features/common/form-validation';
import { Entity, DeleteRegular, Regular, EditRegular } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { editRegularFormCodec, EditRegularValues } from './edit-regular.form';
import { fold as eitherFold } from 'fp-ts/Either';
import { pipe as fpipe } from 'fp-ts/function';
import { entityCodec } from '@codecs';
import { RegularValues } from '@features/common/regular';
import { passengerIdentity, throwDecodeError, toRegular } from '../../common/regular.presenter';

export const toEditRegular = (rawFormValues: unknown): Entity & Regular =>
  fpipe(
    editRegularFormCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('editRegularFormCodec', rawFormValues), toDomain)
  );

export const toDeleteRegular = (rawValue: unknown): Entity =>
  fpipe(
    entityCodec.decode(rawValue),
    eitherFold(throwDecodeError('entityCodec', rawValue), (entity: Entity): Entity => entity)
  );

export const toDeleteRegularSuccessToast = (regular: DeleteRegular): Toast => ({
  content: `Passager supprimé: ${passengerIdentity(regular.regularDeleted)}`,
  status: 'success',
  title: `Un passager à été supprimé`
});

export const toEditRegularSuccessToast = (regular: EditRegular): Toast => ({
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
  comment: regular.comment,
  waypoints: regular.waypoints,
  subcontractedClient: regular.subcontractedClient
});

const toDomain = (formValues: EditRegularValues): Entity & Regular => ({
  id: formValues.regular.id,
  ...toRegular(formValues)
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
