const onlyDefined = (message?: string): message is string => message != null;

export const fieldErrorMessagesPresentation = <T>(errors: T, errorMessages?: Map<string, (errors: T) => string>): string[] =>
  errors == null
    ? []
    : Object.keys(errors ?? {})
        .map((errorKey: string) => errorMessages?.get(errorKey)?.(errors))
        .filter(onlyDefined);
