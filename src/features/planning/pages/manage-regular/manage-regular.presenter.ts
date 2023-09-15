import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { Destination, Entity, Phone, RegularDeleted, RegularDetails, RegularEdited } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { PhoneValues } from '../../components/regular/phones/phones.component';
import { DestinationValues } from '../../components';
import { editRegularFormCodec, EditRegularValues } from './edit-regular.form';
import { fold as eitherFold } from 'fp-ts/Either';
import { pipe as fpPipe } from 'fp-ts/function';
import { entityCodec } from '@codecs';
import { passengerIdentity, throwDecodeError, toRegularDetails } from '../../common/regular.presenter';

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

export const toEditRegularPresentation = (regular: Entity & RegularDetails): EditRegularValues => ({
  regularId: regular.id,
  civility: regular.civility,
  firstname: regular.firstname,
  lastname: regular.lastname,
  phones: regular.phones?.map(toPhoneNumbers),
  homeAddress: regular.home,
  commentary: regular.commentary,
  destinations: regular.destinations?.map(toDestinationValues),
  subcontractedClient: regular.subcontractedClient
});

const toDomain = (formValues: EditRegularValues): Entity & RegularDetails => ({
  id: formValues.regularId,
  ...toRegularDetails(formValues)
});

export const toPhoneNumbers = (phone: Phone): PhoneValues => ({
  phoneType: phone.type,
  // eslint-disable-next-line id-denylist
  phoneNumber: phone.number
});

export const toDestinationValues = (destination: Destination): DestinationValues => ({
  destinationName: destination.name,
  place: destination.place,
  isMedicalDrive: destination.nature === 'medical',
  isTwoWayDrive: destination.kind === 'two-way',
  comment: destination.comment
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
