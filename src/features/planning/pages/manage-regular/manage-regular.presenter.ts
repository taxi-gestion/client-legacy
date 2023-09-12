import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME, ValidationFailedBeforeApiCallError } from '../../errors';
import { Destination, Entity, Phone, RegularDeleted, RegularDetails, RegularEdited } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { PhoneValues } from '../../components/regular/phones/phones.component';
import { DestinationValues } from '../../components';
import { editRegularFormCodec, EditRegularValues } from './edit-regular.form';
import { Errors } from 'io-ts';
import { fold as eitherFold } from 'fp-ts/Either';
import { pipe as fpPipe } from 'fp-ts/function';
import { entityCodec } from '@codecs';

export const toDeleteRegularSuccessToast = (regular: RegularDeleted): Toast => ({
  content: `Passager ${regular.regularDeleted.lastname} ${regular.regularDeleted.firstname} supprimé`,
  status: 'success',
  title: `Un passager à été supprimé`
});

export const toEditRegularSuccessToast = (regular: RegularEdited): Toast => ({
  content: `Passager, ${regular.regularEdited.firstname} ${regular.regularEdited.lastname} modifié`,
  status: 'success',
  title: `Un passager a été modifié`
});

const isEmptyOrWhitespace = (str: string): boolean => str === '' || str.trim() === '';

export const checkIsEntity = (rawValue: unknown): Entity =>
  fpPipe(
    entityCodec.decode(rawValue),
    eitherFold(
      (errors: Errors): never => {
        throw new ValidationFailedBeforeApiCallError(JSON.stringify(errors, null, 2));
      },
      (entity: Entity): Entity => entity
    )
  );

export const toRegularDetailsEntity = (rawFormValues: unknown): Entity & RegularDetails =>
  fpPipe(
    editRegularFormCodec.decode(rawFormValues),
    eitherFold(
      (errors: Errors): never => {
        throw new ValidationFailedBeforeApiCallError(JSON.stringify(errors, null, 2));
      },
      (formValues: EditRegularValues): Entity & RegularDetails => ({
        id: formValues.regularId,
        civility: formValues.civility,
        firstname: formValues.firstname,
        lastname: formValues.lastname,
        phones: formValues.phones?.map(toPhone),
        home: formValues.homeAddress,
        commentary:
          formValues.commentary === undefined || isEmptyOrWhitespace(formValues.commentary) ? undefined : formValues.commentary,
        destinations: formValues.destinations?.map(toDestination),
        subcontractedClient:
          formValues.subcontractedClient === undefined || isEmptyOrWhitespace(formValues.subcontractedClient)
            ? undefined
            : formValues.subcontractedClient
      })
    )
  );

export const regularToPhoneNumbers = (regular: RegularDetails): PhoneValues[] => regular.phones?.map(toPhoneNumbers) ?? [];

export const regularToDestinationsValues = (regular: RegularDetails): DestinationValues[] =>
  regular.destinations?.map(toDestinationValues) ?? [];

export const regularToHomeAddressDisplay = (regular: RegularDetails): string | undefined => regular.home?.context;

export const toPhoneNumbers = (phone: Phone): PhoneValues => ({
  phoneType: phone.type,
  // eslint-disable-next-line id-denylist
  phoneNumber: phone.number
});

export const toPhone = (phoneNumberValue: PhoneValues): Phone => ({
  type: phoneNumberValue.phoneType,
  // eslint-disable-next-line id-denylist
  number: phoneNumberValue.phoneNumber
});

export const toDestinationValues = (destination: Destination): DestinationValues => ({
  name: destination.name,
  place: destination.place,
  isMedicalDrive: destination.nature === 'medical',
  isTwoWayDrive: destination.kind === 'two-way',
  comment: destination.comment
});

export const toDestination = (destination: DestinationValues): Destination => ({
  name: destination.name,
  place: destination.place,
  nature: destination.isMedicalDrive ? 'medical' : 'standard',
  kind: destination.isTwoWayDrive ? 'two-way' : 'one-way',
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
