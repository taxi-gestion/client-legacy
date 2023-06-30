import { Observable, of } from 'rxjs';

export const inMemoryRefreshTokenAction$ = () => (): Observable<void> => of(undefined);
