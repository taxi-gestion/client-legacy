import { sort } from 'fp-ts/Array';
import { contramap, Ord, reverse } from 'fp-ts/Ord';
import { Ord as ordDate } from 'fp-ts/Date';

type WithDatetimeValues = { datetime: string };
//export const sortByDatetime = <T extends WithDatetimeValues>(fares: T[]): T[] => sort(byDatetime)(fares);
export const sortByDatetime = <T extends WithDatetimeValues>(fares: T[], descending: boolean = false): T[] =>
  sort(descending ? reverse(byDatetime) : byDatetime)(fares);

const byDatetime: Ord<WithDatetimeValues> = contramap((fare: { datetime: string }): Date => new Date(fare.datetime))(ordDate);
