import { Entity, PatchRegular, RegularPatchableProperties } from '../../../../definitions';

import { toWaypoint } from '../../../common/waypoint';
import { Decode, Encode, Validation } from 'io-ts';
import { RegularPatchableValues, regularPatchFormCodec } from '../regular.form';
import { toPhone } from '../../../common/phone';
import { regularPatchablePropertiesRules } from '../../../../codecs/domain-rules/regular.rules';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { passengerIdentity } from '../../common/regular.presenter';

export const regularPatchFormDecode: Decode<unknown, Entity & RegularPatchableValues> = (
  input: unknown
): Validation<Entity & RegularPatchableValues> => regularPatchFormCodec.decode(input);

export const toRegularPatchablePropertiesDecode: Decode<
  Entity & RegularPatchableProperties,
  Entity & RegularPatchableProperties
> = (input: unknown): Validation<Entity & RegularPatchableProperties> => regularPatchablePropertiesRules.decode(input);

export const toRegularPatchablePropertiesEncode: Encode<
  Entity & RegularPatchableValues,
  Entity & RegularPatchableProperties
> = (formValues: Entity & RegularPatchableValues): Entity & RegularPatchableProperties =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    id: formValues.id,
    ...('phone' in formValues ? { phones: [toPhone(formValues.phone)] } : {}),
    ...('waypoint' in formValues ? { waypoints: [toWaypoint(formValues.waypoint)] } : {})
  } as Entity & RegularPatchableProperties);

export const toPatchRegularSuccessToast = (regular: PatchRegular): Toast => ({
  content: `Passager modifié: ${passengerIdentity(regular.regularPatched)}`,
  status: 'success',
  title: `Un passager a été modifié`
});
