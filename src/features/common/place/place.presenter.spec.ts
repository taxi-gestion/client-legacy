import { describe, it, expect } from 'vitest';
import { toPlacesValues } from './place.presenter';
import { PlaceValues } from '@features/common/place';

describe('toPlacesValues', (): void => {
  it.each([
    [undefined, []],
    [
      {
        context: 'testContext',
        label: 'testLabel',
        location: {
          latitude: 10,
          longitude: 20
        }
      },
      [
        {
          context: 'testContext',
          label: 'testLabel',
          location: {
            latitude: 10,
            longitude: 20
          }
        }
      ]
    ],
    [
      [
        {
          context: 'testContext1',
          label: 'testLabel1',
          location: {
            latitude: 10,
            longitude: 20
          }
        },
        {
          context: 'testContext2',
          label: 'testLabel2',
          location: {
            latitude: 15,
            longitude: 25
          }
        }
      ],
      [
        {
          context: 'testContext1',
          label: 'testLabel1',
          location: {
            latitude: 10,
            longitude: 20
          }
        },
        {
          context: 'testContext2',
          label: 'testLabel2',
          location: {
            latitude: 15,
            longitude: 25
          }
        }
      ]
    ]
  ])('transforms places correctly', (input: PlaceValues | PlaceValues[] | undefined, expected: PlaceValues[]): void => {
    expect(toPlacesValues(input)).toStrictEqual(expected);
  });
});
