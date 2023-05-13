import { EMPTY, Observable } from 'rxjs';

export const START_LOADING = true as const;
export const STOP_LOADING = false as const;

export const whileLoading =
  <T>(action$: () => Observable<T>) =>
  (isLoading: boolean): Observable<T> =>
    isLoading ? action$() : EMPTY;
