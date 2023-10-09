import { PendingReturnValues } from '../../definitions/fare.definition';
import { toIdentity } from '@features/common/regular';

export const filterOnPassengerAndDriver =
  (searchTerm: string) =>
  (combinedResults: PendingReturnValues[]): PendingReturnValues[] =>
    combinedResults.filter((fareValue: PendingReturnValues): boolean =>
      `${toIdentity(fareValue.passenger)}${fareValue.driver.username}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
