import { VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { EditRegularPresentation } from './edit-regular.form';
import { Destination, Entity, Phone, RegularDeleted, RegularDetails, RegularEdited } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { PhoneValues } from '../../components/regular/phones/phones.component';
import { defaultPlaceValue } from '../../common/fares.presenter';
import { DestinationValues } from '../../components';

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

export const toRegularDetailsEntity = (formValues: EditRegularPresentation): Entity & RegularDetails => ({
  id: formValues.regularId,
  civility: formValues.civility,
  firstname: formValues.firstname,
  lastname: formValues.lastname,
  phones: formValues.phones.length === 0 ? undefined : formValues.phones.map(toPhone),
  // TODO Value should be undefined from the component if place not valid
  home: formValues.homeAddress === defaultPlaceValue ? undefined : formValues.homeAddress,
  commentary: isEmptyOrWhitespace(formValues.commentary) ? undefined : formValues.commentary,
  destinations: formValues.destinations.map(toDestination),
  subcontractedClient: isEmptyOrWhitespace(formValues.subcontractedClient) ? undefined : formValues.subcontractedClient
});

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
