// eslint-disable-next-line @typescript-eslint/no-shadow
import { Decoder, ValidationError } from 'io-ts';
import { Either, left } from 'fp-ts/Either';
import { DevFriendlyError, Errors, InfrastructureError, errorReporter } from './error-reporter';

describe('ErrorReporter specification tests', (): void => {
  // Define the error message and context
  const stringError: ValidationError = {
    context: [
      {
        actual: undefined,
        key: '',
        type: {
          name: 'string'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as Decoder<any, any>
      }
    ],
    message: 'Type check failed',
    // eslint-disable-next-line id-denylist
    value: undefined
  };

  const validationError1: ValidationError = {
    context: [
      {
        actual: undefined,
        key: 'clientIdentity',
        type: {
          name: 'isRegisteredUser'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as Decoder<any, any>
      }
    ],
    message: `Rules check failed, 'Julien' is not included in the registered users list`,
    value: 'Julien'
  };

  const validationError2: ValidationError = {
    context: [
      {
        actual: undefined,
        key: '',
        type: {
          name: 'string'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as Decoder<any, any>
      }
    ],
    message: 'Type check failed',
    // eslint-disable-next-line id-denylist
    value: undefined
  };

  const serviceUnavailable: InfrastructureError = {
    isInfrastructureError: true,
    code: '503',
    stack: 'no stack available',
    message: `selectFaresForDate database error - Error: connect ECONNREFUSED 127.0.0.1:5432`,
    // eslint-disable-next-line id-denylist
    value: 'Error'
  };

  const internalServerError: InfrastructureError = {
    isInfrastructureError: true,
    code: '500',
    stack: 'no stack available',
    message: `insertFareIn database error - relation "scheduled_fares" does not exist`,
    // eslint-disable-next-line id-denylist
    value: 'Error'
  };

  const simpleErrors: Either<Errors, unknown> = left<Errors, unknown>([stringError]);
  const singleErrors: Either<Errors, unknown> = left<Errors, unknown>([validationError1]);
  const multipleErrors: Either<Errors, unknown> = left<Errors, unknown>([validationError1, validationError2]);
  const serviceUnavailableErrors: Either<Errors, unknown> = left<Errors, unknown>([serviceUnavailable]);
  const infrastructureErrors: Either<Errors, unknown> = left<Errors, unknown>([internalServerError]);

  it.each([
    [
      simpleErrors,
      [
        {
          humanReadable: 'Type check failed',
          errorValue: 'undefined',
          failingRule: 'string',
          code: '400',
          type: 'validation' as const
        }
      ]
    ],
    [
      singleErrors,
      [
        {
          humanReadable: `Rules check failed, 'Julien' is not included in the registered users list`,
          errorValue: 'Julien',
          failingRule: 'isRegisteredUser.clientIdentity',
          code: '422',
          type: 'validation' as const
        }
      ]
    ],
    [
      multipleErrors,
      [
        {
          humanReadable: `Rules check failed, 'Julien' is not included in the registered users list`,
          errorValue: 'Julien',
          failingRule: 'isRegisteredUser.clientIdentity',
          code: '422',
          type: 'validation' as const
        },
        {
          humanReadable: 'Type check failed',
          errorValue: 'undefined',
          failingRule: 'string',
          code: '400',
          type: 'validation' as const
        }
      ]
    ],
    [
      serviceUnavailableErrors,
      [
        {
          humanReadable: `A technical dependency of the service is unavailable - selectFaresForDate database error - Error: connect ECONNREFUSED 127.0.0.1:5432`,
          errorValue: 'Error',
          code: '503',
          type: 'exception' as const
        }
      ]
    ],
    [
      infrastructureErrors,
      [
        {
          humanReadable: `Internal Server Error - insertFareIn database error - relation "scheduled_fares" does not exist`,
          errorValue: 'Error',
          code: '500',
          type: 'exception' as const
        }
      ]
    ]
  ])('should return %o when errors are %o', (payload: Either<Errors, unknown>, expectedResult: DevFriendlyError[]): void => {
    expect(errorReporter.report(payload)).toStrictEqual(expectedResult);
  });
});
