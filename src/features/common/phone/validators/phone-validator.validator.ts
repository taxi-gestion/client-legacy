import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PhoneValues } from '../definitions/phone.definition';

export const selectedPhoneValidator =
  (selectedPhone: PhoneValues | undefined): ValidatorFn =>
  (): ValidationErrors | null =>
    // eslint-disable-next-line id-denylist
    isPhone(selectedPhone?.phoneNumber) ? null : { invalidPhoneNumber: { value: selectedPhone?.phoneNumber } };

const formatPhone = (phone?: string): string => phone?.replace('(0)', '').replace(/[^+\d]/gu, '') ?? '';

const isPhone = (phone?: string): boolean => /^(?:(?:\+|00)33|0)[1-9]\d{8}$/gu.test(formatPhone(phone));

export const phoneNumberValidator = (control: AbstractControl): ValidationErrors | null =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,id-denylist
  isPhone(control.value) ? null : { invalidPhoneNumber: { value: control.value } };
