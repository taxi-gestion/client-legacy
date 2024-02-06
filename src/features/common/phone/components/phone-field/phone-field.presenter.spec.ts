import { describe, it, expect } from 'vitest';
import { filterOnPhoneValuesProperties } from './phone-field.presenter';
import { PhoneValues } from '../../definitions/phone.definition';

describe('Phone value filtering', (): void => {
  const testCases: [string, PhoneValues[], PhoneValues[]][] = [
    [
      'Mobile',
      [
        { phoneType: 'Mobile', phoneNumber: '123456' },
        { phoneType: 'Landline', phoneNumber: '654321' }
      ],
      [{ phoneType: 'Mobile', phoneNumber: '123456' }]
    ],
    [
      '654321',
      [
        { phoneType: 'Mobile', phoneNumber: '123456' },
        { phoneType: 'Landline', phoneNumber: '654321' }
      ],
      [{ phoneType: 'Landline', phoneNumber: '654321' }]
    ],
    [
      'Absent',
      [
        { phoneType: 'Mobile', phoneNumber: '123456' },
        { phoneType: 'Landline', phoneNumber: '654321' }
      ],
      []
    ],
    [
      '123',
      [
        { phoneType: 'Mobile', phoneNumber: '123456' },
        { phoneType: 'Landline', phoneNumber: '654789' }
      ],
      [{ phoneType: 'Mobile', phoneNumber: '123456' }]
    ]
  ];

  it.each(testCases)(
    'filters phone values correctly for searchTerm %s',
    (searchTerm: string, combinedResults: PhoneValues[], expectedResults: PhoneValues[]): void => {
      const filterFunction: (values: PhoneValues[]) => PhoneValues[] = filterOnPhoneValuesProperties(searchTerm);
      const actualResults: PhoneValues[] = filterFunction(combinedResults);
      expect(actualResults).toStrictEqual(expectedResults);
    }
  );
});
