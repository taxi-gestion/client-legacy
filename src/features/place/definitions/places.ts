export type Localisation = {
  latitude: number;
  longitude: number;
};

export type Place = {
  context: string;
  label: string;
  localisation: Localisation;
};

export type PlacePresentation = {
  context: string;
  label: string;
  localisation: Localisation;
};

export type PlaceTransfer = {
  context: string;
  label: string;
  latitude: number;
  longitude: number;
};

export const toPlaces = (places: PlaceTransfer[]): Place[] => places.map(toPlace);

export const toPlace = (place: PlaceTransfer): Place => ({
  context: place.context,
  label: place.context,
  localisation: {
    latitude: place.latitude,
    longitude: place.longitude
  }
});
