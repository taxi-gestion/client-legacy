import { Phone } from '@definitions';
import { PhoneValues } from './definitions/phone.definition';

export const phoneEmptyValue: PhoneValues = {
  phoneNumber: '',
  phoneType: ''
};

export const toPhone = (phoneNumberValue: PhoneValues): Phone => ({
  type: phoneNumberValue.phoneType,
  // eslint-disable-next-line id-denylist
  number: phoneNumberValue.phoneNumber
});

export const toPhoneValues = (phone: Phone): PhoneValues => ({
  phoneType: phone.type,
  // eslint-disable-next-line id-denylist
  phoneNumber: phone.number
});

export const toPhonesValues = (phones: Phone[] | undefined): PhoneValues[] => phones?.map(toPhoneValues) ?? [];
