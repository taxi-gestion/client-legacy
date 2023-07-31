import { Place } from '@features/place';

export const isValidPlace = (place: Place): boolean => !isNaN(place.location.latitude) && !isNaN(place.location.longitude);
