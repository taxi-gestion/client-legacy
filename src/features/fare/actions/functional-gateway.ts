import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Validation, Encode, Decode } from 'io-ts';

// TODO Remove the dependency to angular to move in domain
import { ValidationFailedOnApiResult } from '@features/common/form-validation';

import { pipe as fpipe } from 'fp-ts/lib/function';
import { DevFriendlyError, errorReporter } from '../../../codecs';
import { RemoteServiceUnavailable } from '../../common/form-validation/errors/service-unavailable.error';
import { DecodeError } from '../../common/form-validation/errors/decode.error';
import { NewHttpStatus } from '../../common/form-validation/errors/new-http-status.error';

// prettier-ignore
export const apiPostWithValidation =
  <Domain, Transfer, Result>(
    httpClient: HttpClient,
    encode: Encode<Domain, Transfer>,
    decode: Decode<unknown, Result>,
    url: (input: Domain) => string
  ) =>
  (input: Domain): Observable<Result> =>
    fpipe(
      httpClient.post<unknown>(url(input), encode(input)),
      withValidation<Result>(decode)
    );

export const apiGetWithValidation =
  <RequestParameters, Result>(http: HttpClient, decode: Decode<unknown, Result>, url: (input: RequestParameters) => string) =>
  (input: RequestParameters): Observable<Result> =>
    fpipe(http.get<unknown>(url(input)), withValidation<Result>(decode));

export const apiDeleteWithValidation =
  <RequestParameters, Result>(http: HttpClient, decode: Decode<unknown, Result>, url: (input: RequestParameters) => string) =>
  (input: RequestParameters): Observable<Result> =>
    fpipe(http.delete<unknown>(url(input)), withValidation<Result>(decode));

const withValidation =
  <Result>(decode: Decode<unknown, Result>) =>
  (source: Observable<unknown>): Observable<Result> =>
    source.pipe(
      map((response: unknown): Result => validateApiResponse<Result>(response, decode)),
      catchError(
        (error: Error | HttpErrorResponse, caught: Observable<Result>): Observable<never> =>
          handleApiError<Result>(error, caught)
      )
    );
const validateApiResponse = <Result>(response: unknown, decode: Decode<unknown, Result>): Result => {
  const validation: Validation<Result> = decode(response);
  if (validation._tag === 'Left') {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw errorReporter.report(validation);
  }

  return validation.right;
};

// TODO Need to improve this
// eslint-disable-next-line max-statements
const handleApiError = <Result>(
  error: DevFriendlyError | Error | HttpErrorResponse,
  caught: Observable<Result>
): Observable<never> => {
  if (error instanceof ValidationFailedOnApiResult) return throwError((): Error => error);

  if ((error as { type: string }).type === 'validation') {
    return throwError((): Error => new DecodeError((error as DevFriendlyError).failingRule));
  }

  if ((error as { name: string }).name === 'HttpErrorResponse') {
    //if (error.type === 'validation') return throwError((): Error => {throw error} );
    const httpError: HttpErrorResponse = error as HttpErrorResponse;

    if (httpError.status === 500) {
      return throwError((): Error => new RemoteServiceUnavailable(httpError.message));
    }

    return throwError((): Error => new NewHttpStatus(`${String(httpError.status)} | ${httpError.message}`));
  }

  switch ((error as HttpErrorResponse).error?.__type) {
    default:
      return throwError((): Observable<Result> => caught);
  }
};
