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
