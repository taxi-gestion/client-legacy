import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchUserQuery, User } from '@features/common/user';

export const cognitoListUsersWithDriverGroupQuery$ =
  (httpClient: HttpClient): SearchUserQuery =>
  (_search: string): Observable<User[]> =>
    httpClient.get<User[]>(`/api/list-drivers`);
