import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity, Scheduled } from '../../../../definitions';
import { scheduledFaresCodec } from '../../../../codecs';
import { apiGetWithValidation } from '../../../fare/actions/functional-gateway';
import { Validation } from 'io-ts';
import { DriverFaresForDateQuery } from '../../providers';

type DriverAndDate = { driver: Entity; date: string };

const driverFaresForDateUrl = (driverAndDate: DriverAndDate): string =>
  `/api/driver-agenda/${driverAndDate.driver.id}/${driverAndDate.date}`;

export const driverFaresForDateForDateQuery$ =
  (httpClient: HttpClient): DriverFaresForDateQuery =>
  (driverAndDate: DriverAndDate): Observable<(Entity & Scheduled)[]> =>
    apiGetWithValidation<DriverAndDate, (Entity & Scheduled)[]>(
      httpClient,
      (input: unknown): Validation<(Entity & Scheduled)[]> => scheduledFaresCodec.decode(input),
      driverFaresForDateUrl
    )(driverAndDate);
