import { ScheduledFareValues } from './definitions/fare.definition';

export const scheduledFareEmptyValue: ScheduledFareValues = {
  datetime: '',
  departure: undefined,
  destination: undefined,
  distance: 0,
  driver: undefined,
  duration: 0,
  id: '',
  kind: undefined,
  nature: undefined,
  passenger: undefined,
  status: 'scheduled'
} as unknown as ScheduledFareValues;
//
//export const toFare = (fareValue: ScheduledFareValues): Fare => ({
//  ...fareValue
//});
//
//export const toFareValuesOrUndefined = (fare: Fare | ScheduledFareValues | undefined): ScheduledFareValues | undefined =>
//  fare === undefined ? undefined : fare;
//
//export const toFaresValues = (fares: Fare | Fare[] | ScheduledFareValues | ScheduledFareValues[] | undefined): ScheduledFareValues[] => {
//  if (fares === undefined) return [];
//
//  return 'context' in fares ? [fares] : fares;
//};
//
//export const toFareValues = (fare: Fare): ScheduledFareValues => fare;
