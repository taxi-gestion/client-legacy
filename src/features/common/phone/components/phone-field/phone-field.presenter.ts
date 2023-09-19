import { PhoneValues } from '../../definitions/phone.definition';

export const filterOnPhoneValuesProperties =
  (searchTerm: string) =>
  (combinedResults: PhoneValues[]): PhoneValues[] =>
    combinedResults.filter((phoneValue: PhoneValues): boolean =>
      `${phoneValue.phoneType}${phoneValue.phoneNumber}`.includes(searchTerm)
    );
