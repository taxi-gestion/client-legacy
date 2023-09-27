import { ScheduledFareValues } from '../../definitions/fare.definition';
import { toIdentity } from '@features/common/regular';

export const filterOnPassengerAndDriver =
  (searchTerm: string) =>
  (combinedResults: ScheduledFareValues[]): ScheduledFareValues[] =>
    combinedResults.filter((fareValue: ScheduledFareValues): boolean =>
      `${toIdentity(fareValue.passenger)}${fareValue.driver.username}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
