import { string as ioString, type as ioType, Type } from 'io-ts';
import { PhoneValues } from '../definitions/phone.definition';

export const phoneValuesCodec: Type<PhoneValues> = ioType({
  phoneType: ioString,
  phoneNumber: ioString
});
