import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { FareForDate, FaresForDate, FaresForDateQuery, FareStatus } from '../../providers';

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

const toFaresForDate = (fares: FareTransfer[]): FaresForDate =>
  fares.map(
    (fare: FareTransfer): FareForDate => ({
      id: fare.rid,
      date: fare.date,
      distance: fare.driveDistanceInMeters,
      duration: fare.duration,
      status: fare.status as FareStatus,
      startTime: fare.startTime
    })
  );

export const faresForDateQuery$ =
  (httpClient: HttpClient): FaresForDateQuery =>
  (date: Date): Observable<FaresForDate> => {
    date.setHours(0, 0, 0, 0);
    return httpClient.get<FareTransfer[]>(`/api/fares-for-date/${date.toISOString()}`).pipe(map(toFaresForDate));
  };
