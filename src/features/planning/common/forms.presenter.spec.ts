import { nullToUndefined } from './forms.presenter';

describe('all forms presenter', (): void => {
  describe('nullToUndefined should convert recursively null values from forms to undefined', (): void => {
    it.each([
      [null, undefined],
      [
        {
          civility: 'Mr',
          firstname: 'Jean',
          lastname: 'Dupont',
          phones: [{ phoneType: 'portable', phoneNumber: '0684319595' }],
          homeAddress: null,
          destinations: [
            {
              name: 'Clinique du Vinatier',
              place: {
                context: '95 Bd Pinel, 69678 Bron, France',
                label: 'Centre Hospitalier Le Vinatier',
                location: { latitude: 45.7419456, longitude: 4.8942535 }
              },
              isTwoWayDrive: true,
              isMedicalDrive: true,
              comment: null
            }
          ],
          commentary: null,
          subcontractedClient: null
        },
        {
          civility: 'Mr',
          firstname: 'Jean',
          lastname: 'Dupont',
          phones: [{ phoneType: 'portable', phoneNumber: '0684319595' }],
          homeAddress: undefined,
          destinations: [
            {
              name: 'Clinique du Vinatier',
              place: {
                context: '95 Bd Pinel, 69678 Bron, France',
                label: 'Centre Hospitalier Le Vinatier',
                location: { latitude: 45.7419456, longitude: 4.8942535 }
              },
              isTwoWayDrive: true,
              isMedicalDrive: true,
              comment: undefined
            }
          ],
          commentary: undefined,
          subcontractedClient: undefined
        }
      ]
    ])('"%s" returns "%s"', (rawValue: unknown, expected: unknown): void => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(nullToUndefined(rawValue)).toStrictEqual(expected);
    });
  });
});
