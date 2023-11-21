import { FormGroup } from '@angular/forms';
import { REMOTE_SERVICE_UNAVAILABLE_ERROR_NAME } from '../../common/form-validation/errors/service-unavailable.error';
import { DECODE_ERROR_NAME, DecodeError } from '../../common/form-validation/errors/decode.error';
import { Errors, InfrastructureError, isInfrastructureError, ValidationError } from '../../../codecs/error-reporter';

export type FormattedError = { field?: string; errors: Record<string, unknown> };
export const setErrorsToForm =
  (form: FormGroup) =>
  (handledErrors: FormattedError[]): void => {
    const aggregatedErrors: Record<string, Record<string, unknown>> = {};

    handledErrors.forEach((handledError: FormattedError): void => {
      const key: string = handledError.field ?? '__form';
      aggregatedErrors[key] = {
        ...(aggregatedErrors[key] ?? {}),
        ...handledError.errors
      };
    });

    // eslint-disable-next-line @typescript-eslint/typedef
    Object.entries(aggregatedErrors).forEach(([field, errors]): void => {
      if (field === '__form') {
        form.setErrors(errors);
      } else {
        form.get(field)?.setErrors(errors);
      }
    });
  };

export const toFormErrors = (error: Error): FormattedError[] => {
  const errors: FormattedError[] | undefined = fareErrorFormatMap.get(error.name)?.(error);
  return (
    errors ?? [
      {
        errors: { unknown: true }
      }
    ]
  );
};

const fareErrorFormatMap: Map<string, (error: Error) => FormattedError[]> = new Map([
  [
    REMOTE_SERVICE_UNAVAILABLE_ERROR_NAME,
    (error: Error): FormattedError[] => [
      {
        field: '__form',
        errors: {
          [REMOTE_SERVICE_UNAVAILABLE_ERROR_NAME]: error
        }
      }
    ]
  ],
  [DECODE_ERROR_NAME, (error: DecodeError): FormattedError[] => [...(error.cause as Errors).map(toFormattedError)]]
]);

const toFormattedError = (error: Error | InfrastructureError | ValidationError): FormattedError => {
  if (isInfrastructureError(error)) throw new Error('Not happening');

  if (error instanceof Error)
    return toFormErrors(error)[0] ?? { field: '__form', errors: { unknown: `${error.name} | ${error.message}` } };

  const failingKey: string = error.context.at(-1)?.key ?? 'unknownKey';
  const failingRule: string = error.context.at(-1)?.type.name ?? 'unknownRule';
  return {
    errors: { [failingKey]: failingRule },
    field: error.context.at(1)?.key ?? '__form'
  };
};
