import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { FareByDayPresentation, FareStatus } from '../../presentation';

export type FareTransfer = {
  clientComment: string | undefined;
  clientIdentity: string;
  clientPhone: string;
  createdAt: string;
  creatorIdentity: string;
  date: string;
  driveDistanceInMeters: string;
  driveComment: string | undefined;
  driveDistanceOverride: string | undefined;
  driveFrom: string;
  driveKind: 'one-way' | 'outward' | 'return';
  driveName: string;
  driveNature: 'medical' | 'standard';
  driveRid: string;
  driverIdentity: string | undefined;
  driveTo: string;
  duration: string;
  rid: string;
  startTime: string;
  status: string;
  subcontractorIdentity: string | undefined;
  updatedAt: string;
  weeklyRecurrence: string;
};

const toFareByDayPresentation = (fares: FareTransfer[]): FareByDayPresentation[] =>
  fares.map((fare: FareTransfer) => ({
    id: fare.rid,
    date: fare.date,
    distance: fare.driveDistanceInMeters,
    duration: fare.duration,
    status: fare.status as FareStatus,
    startTime: fare.startTime
  }));

export const faresByDayRead$ = (httpClient: HttpClient) => (): Observable<FareByDayPresentation[]> =>
  httpClient.get<FareTransfer[]>('/api/fares/2019-03-05').pipe(map(toFareByDayPresentation));
