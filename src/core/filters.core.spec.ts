// Define some mock data to use in the tests
import { filterByProperties, PropertySelectors } from './filters.core';

type Item = {
  city: string;
  name: string;
  age: number;
};

const mockData: Item[] = [
  {
    name: 'John Doe',
    age: 30,
    city: 'New York'
  },
  {
    name: 'Jane Smith',
    age: 25,
    city: 'Los Angeles'
  },
  {
    name: 'Jake Doe',
    age: 28,
    city: 'Chicago'
  }
];

describe('filterByProperties', (): void => {
  it.each([
    // Define the selectors as functions to comply with the type definition
    [{ name: (item: Item): string => item.name }, 'doe', [mockData[0], mockData[2]]],
    [{ name: (item: Item): string => item.name }, 'jane', [mockData[1]]],
    [{ city: (item: Item): string => item.city }, 'new york', [mockData[0]]],
    [{ name: (item: Item): string => item.name }, 'jake', [mockData[2]]]
  ])(
    'filters data by properties (%o, %s)',
    (selectors: PropertySelectors<Item>, searchTerm: string, expected: (Item | undefined)[]): void => {
      const filterFunc: (searchTerm: string) => (results: Item[]) => Item[] = filterByProperties(selectors);
      const result: Item[] = filterFunc(searchTerm)(mockData);
      expect(result).toStrictEqual(expected);
    }
  );
});
