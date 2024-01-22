import { Phone } from '@definitions';
import { PhoneValues } from './definitions/phone.definition';

export const emptyPhoneValue: PhoneValues = {
  phoneNumber: '',
  phoneType: ''
};

export const toPhone = (phoneValues: PhoneValues): Phone => ({
  type: phoneValues.phoneType,
  number: phoneValues.phoneNumber
});

export const toPhoneValues = (phone: Phone): PhoneValues => ({
  phoneType: phone.type,
  phoneNumber: phone.number
});

export const toPhonesValues = (phones: Phone[] | undefined): PhoneValues[] => phones?.map(toPhoneValues) ?? [];
