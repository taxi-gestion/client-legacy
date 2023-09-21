import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PhoneValues } from '../definitions/phone.definition';

export const selectedPhoneValidator =
  (selectedPhone: PhoneValues | undefined): ValidatorFn =>
  (): ValidationErrors | null =>
    isPhoneNumber(selectedPhone?.phoneNumber) ? null : { invalidPhoneNumber: { value: selectedPhone?.phoneNumber } };

const formatPhone = (phone?: string): string => phone?.replace('(0)', '').replace(/[^+\d]/gu, '') ?? '';

const isPhoneString = (phone: string): boolean => /^(?:(?:\+|00)33|0)[1-9]\d{8}$/gu.test(formatPhone(phone));

export const phoneNumberValidator = (control: AbstractControl): ValidationErrors | null =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-assignment
  isPhoneNumber(control.value) ? null : { invalidPhoneNumber: { value: control.value } };

const isPhoneNumber = (phoneNumber: string | undefined): boolean =>
  phoneNumber === undefined ? false : isPhoneString(phoneNumber);

export const phoneValidator = (control: AbstractControl): ValidationErrors | null =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-assignment
  isPhoneValues(control.value) ? null : { invalidPhoneNumber: { value: control.value } };

const isPhoneValues = (phoneValues: PhoneValues | undefined): boolean =>
  phoneValues === undefined ? false : isPhone(phoneValues);

const isPhone = (phone: PhoneValues): boolean => phone.phoneType.length > 1 && isPhoneNumber(phone.phoneNumber);
