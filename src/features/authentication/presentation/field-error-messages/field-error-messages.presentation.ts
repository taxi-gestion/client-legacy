import { ErrorMessages } from '@features/authentication/presentation/message.error';

const onlyDefined = (message?: string): message is string => message != null;

export const fieldErrorMessagesPresentation = <T>(error: T, errorMessages?: ErrorMessages<T>): string[] =>
  error == null
    ? []
    : Object.keys(error)
        .map((errorKey: string): string | undefined => errorMessages?.get(errorKey)?.(error))
        .filter(onlyDefined);
