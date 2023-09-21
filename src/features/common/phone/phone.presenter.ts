import { Phone } from '@definitions';
import { PhoneValues } from './definitions/phone.definition';

export const phoneEmptyValue: PhoneValues = {
  phoneNumber: '',
  phoneType: ''
};

export const toPhone = (phoneNumberValue: PhoneValues): Phone => ({
  type: phoneNumberValue.phoneType,
  number: phoneNumberValue.phoneNumber
});

export const toPhoneValues = (phone: Phone): PhoneValues => ({
  phoneType: phone.type,
  phoneNumber: phone.number
});

export const toPhonesValues = (phones: Phone[] | undefined): PhoneValues[] => phones?.map(toPhoneValues) ?? [];
