export type Location = {
  latitude: number;
  longitude: number;
};
const isValidLatitude = (locationData: Location): boolean => locationData.latitude >= -90 && locationData.latitude <= 90;

const isValidLongitude = (locationData: Location): boolean => locationData.longitude >= -180 && locationData.longitude <= 180;

export const isValidLocation = (locationData: Location): locationData is Location =>
  isValidLatitude(locationData) && isValidLongitude(locationData);

//const throwLocationError = (locationData: LocationToValidate): Location => {
//  if (!isValidLatitude(locationData)) {
//    throw new LatitudeError(locationData.latitude);
//  }
//
//  if (!isValidLongitude(locationData)) {
//    throw new LongitudeError(locationData.longitude);
//  }
//
//  throw new Error();
//};
//
///* eslint-disable-next-line @typescript-eslint/naming-convention */
//export const Location = (location: LocationToValidate): Location =>
//  isValidLocation(location) ? { ...location } : throwLocationError(location);
