import { Entity, Scheduled } from '../../../../definitions';
import { toTime } from '../../../common/presentation';

export type DriverScheduledFarePresentation = Entity &
  Scheduled & {
    time: string;
    link: string;
    state: 'waiting' | 'started' | 'finished';
  };
export const toDriverScheduledFaresPresentation = (fares: (Entity & Scheduled)[]): DriverScheduledFarePresentation[] =>
  fares.map(toDriverScheduledFarePresentation);

export const toDriverScheduledFarePresentation = (fare: Entity & Scheduled): DriverScheduledFarePresentation => ({
  ...fare,
  time: toTime(fare.datetime),
  link: `/driver/agenda/detail/${fare.id}`,
  state: 'waiting'
});
