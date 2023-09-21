export type LocationValues = {
  latitude: number;
  longitude: number;
};

export type PlaceValues = {
  context: string;
  label: string;
  location: LocationValues;
};
