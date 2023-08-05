import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SearchPassengerQuery } from '../../providers';
import { Passenger } from '../../definitions';

export const searchPassengersQuery$ =
  (_httpClient: HttpClient): SearchPassengerQuery =>
  (_search: string): Observable<Passenger[]> =>
    of([
      {
        firstname: 'Romain',
        lastname: 'Cambonie',
        phone: '0684319515'
      },
      {
        firstname: 'Marc',
        lastname: 'Gavanier',
        phone: '0684319516'
      },
      {
        firstname: 'Marie',
        lastname: 'Duchamps',
        phone: '0684319517'
      },
      {
        firstname: 'Pierre-Antoine',
        lastname: 'De Lacolline',
        phone: '0684319518'
      }
    ]);
//httpClient
//  .get<CognitoPassengersTransfer[]>(
//    `/api/fares-for-date/${search}`
//  )
//  .pipe(map(toPassengers));
//
