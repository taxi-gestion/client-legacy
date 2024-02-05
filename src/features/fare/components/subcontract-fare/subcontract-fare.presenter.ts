import { Entity, SubcontractFare, ToSubcontracted } from '../../../../definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toIdentity } from '../../../regular';
import { subcontractFareFormCodec, ToSubcontractValues } from './subcontract-fare.form';
import { Decode, Encode, Validation } from 'io-ts';
import { toSubcontractedRules } from '../../../../codecs/domain-rules/fares.rules';

export const subcontractFareFormDecode: Decode<unknown, Entity & ToSubcontractValues> = (
  input: unknown
): Validation<Entity & ToSubcontractValues> => subcontractFareFormCodec.decode(input);

export const toToSubcontractedDecode: Decode<Entity & ToSubcontracted, Entity & ToSubcontracted> = (
  input: unknown
): Validation<Entity & ToSubcontracted> => toSubcontractedRules.decode(input);

export const toToSubcontractedEncode: Encode<Entity & ToSubcontractValues, Entity & ToSubcontracted> = (
  formValues: Entity & ToSubcontractValues
): Entity & ToSubcontracted =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    id: formValues.id,
    subcontractor: { identity: formValues.subcontractor },
    status: 'to-subcontracted'
  });

export const toSubcontractFareSuccessToast = (fare: SubcontractFare): Toast => ({
  content: `Course sous-traitée: ${toIdentity(fare.subcontracted.passenger)} à ${fare.subcontracted.subcontractor.identity}${
    fare.pendingCreated === undefined ? '' : ', retour rajouté aux retours en attente'
  }`,
  status: 'success',
  title: `Un passager a été modifié`
});
