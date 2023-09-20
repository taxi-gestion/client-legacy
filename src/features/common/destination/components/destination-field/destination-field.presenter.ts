import { DestinationValues } from '../../definitions/destination.definition';

export const filterOnDestinationValuesProperties =
  (searchTerm: string) =>
  (combinedResults: DestinationValues[]): DestinationValues[] =>
    combinedResults.filter((destinationValue: DestinationValues): boolean =>
      `${destinationValue.destinationName}${destinationValue.place.context}${destinationValue.place.label}`.includes(searchTerm)
    );
