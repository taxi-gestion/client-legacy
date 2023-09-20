import { DriverValues } from '../../definitions/driver.definition';

export const filterOnDriverValuesProperties =
  (searchTerm: string) =>
  (combinedResults: DriverValues[]): DriverValues[] =>
    combinedResults.filter((driverValue: DriverValues): boolean =>
      `${driverValue.identifier}${driverValue.username}`.includes(searchTerm)
    );
