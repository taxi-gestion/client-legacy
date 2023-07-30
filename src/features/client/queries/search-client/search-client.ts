import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SearchClientQuery } from '../../providers';
import { Client } from '../../definitions';

export type ClientsTransfer = {
  data: string;
};

//const toClients = (fares: CognitoClientsTransfer[]): Client[] =>
//  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//  fares.map(
//    (_fare: CognitoClientsTransfer): Client => ({
//      firstname: "plop",
//      phone: [],
//      clientname: "plip"
//    })
//  );

export const searchClientsQuery$ =
  (_httpClient: HttpClient): SearchClientQuery =>
  (_search: string): Observable<Client[]> =>
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
//  .get<CognitoClientsTransfer[]>(
//    `/api/fares-for-date/${search}`
//  )
//  .pipe(map(toClients));
//
