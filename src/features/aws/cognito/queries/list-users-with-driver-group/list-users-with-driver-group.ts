import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SearchUserQuery, User } from '@features/common/user';

export type CognitoUsersTransfer = {
  data: string;
};

//const toUsers = (fares: CognitoUsersTransfer[]): User[] =>
//  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//  fares.map(
//    (_fare: CognitoUsersTransfer): User => ({
//      identifier: "plop",
//      groups: [],
//      username: "plip"
//    })
//  );

export const cognitoListUsersWithDriverGroupQuery$ =
  (_httpClient: HttpClient): SearchUserQuery =>
  (_search: string): Observable<User[]> =>
    of([
      {
        identifier: 'romain.cambonie@gmail.com',
        username: 'Romain Cambonie',
        groups: ['driver', 'manager']
      },
      {
        identifier: '+33684319519',
        username: 'Romain Cambonie 2',
        groups: ['driver']
      },
      {
        identifier: 'manager-driver@taxi-gestion.com',
        username: 'Manager Driver',
        groups: ['driver', 'manager']
      },
      {
        identifier: 'driver@taxi-gestion.com',
        username: 'Driver',
        groups: ['driver']
      }
    ]);
//httpClient
//  .get<CognitoUsersTransfer[]>(
//    `/api/fares-for-date/${search}`
//  )
//  .pipe(map(toUsers));
//
