import { PlaceValues } from '../../definitions/place.definition';

export const filterOnPlaceValuesProperties =
  (searchTerm: string) =>
  (combinedResults: PlaceValues[]): PlaceValues[] =>
    combinedResults.filter((placeValue: PlaceValues): boolean =>
      `${placeValue.context}${placeValue.label}`.includes(searchTerm)
    );
