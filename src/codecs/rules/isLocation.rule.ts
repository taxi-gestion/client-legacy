import { brand, BrandC, Branded, Type } from 'io-ts';
// eslint-disable-next-line @typescript-eslint/no-shadow
import { Location } from '../../definitions';
import { locationCodec } from '../../codecs';

export const isLocation: BrandC<Type<Location>, LocationBrand> = brand(
  locationCodec,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  (location: Location): location is Branded<Location, LocationBrand> => isValidLocation(location),
  'isLocation'
);

type LocationBrand = {
  readonly isLocation: unique symbol;
};

const isValidLatitude = (locationData: Location): boolean => locationData.latitude >= -90 && locationData.latitude <= 90;

const isValidLongitude = (locationData: Location): boolean => locationData.longitude >= -180 && locationData.longitude <= 180;

export const isValidLocation = (locationData: Location): locationData is Location =>
  isValidLatitude(locationData) && isValidLongitude(locationData);
