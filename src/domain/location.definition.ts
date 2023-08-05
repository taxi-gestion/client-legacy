export type Location = {
  latitude: number;
  longitude: number;
};
const isValidLatitude = (locationData: Location): boolean => locationData.latitude >= -90 && locationData.latitude <= 90;

const isValidLongitude = (locationData: Location): boolean => locationData.longitude >= -180 && locationData.longitude <= 180;

export const isValidLocation = (locationData: Location): locationData is Location =>
  isValidLatitude(locationData) && isValidLongitude(locationData);
