import { ValueProvider } from '@angular/core';

export type GoogleMaps = {
  apiKey: string;
};

export const GOOGLE_MAPS_API_KEY: 'google.maps.apikey' = 'google.maps.apikey' as const;

export const googleMapsApiKeyValueProvider = (useValue: GoogleMaps): ValueProvider => ({
  useValue,
  provide: GOOGLE_MAPS_API_KEY
});
