import { pipe } from 'fp-ts/function';
import { some } from 'fp-ts/Array';
import { filter } from 'fp-ts/lib/Array';

export type PropertySelector<T> = keyof T | ((item: T) => string);
export type PropertySelectors<T> = Record<string, PropertySelector<T>>;

export const filterByProperties =
  <T>(selectors: PropertySelectors<T>) =>
  (searchTerm: string) =>
  (results: T[]): T[] =>
    pipe(results, filter(filterBySelector(selectors, searchTerm)));

const matchIgnoreCase =
  (searchTerm: string) =>
  (text: string): boolean =>
    text.toLowerCase().includes(searchTerm.toLowerCase());

const isFunction = <T>(x: PropertySelector<T>): x is (item: T) => string => typeof x === 'function';

const propertyToString = <T>(selector: PropertySelector<T>, item: T): string =>
  isFunction(selector) ? selector(item) : String(item[selector]);

const filterBySelector =
  <T>(selectors: PropertySelectors<T>, searchTerm: string) =>
  (item: T): boolean =>
    pipe(
      Object.entries(selectors),
      some(([_, selector]: [string, PropertySelector<T>]): boolean =>
        matchIgnoreCase(searchTerm)(propertyToString(selector, item))
      )
    );
