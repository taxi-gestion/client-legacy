import { ValidationFailedBeforeApiCall } from './validation-failed-before-call.error';

export const throwDecodeError = (codec: string, rawFormValues: unknown) => (): never => {
  throw new ValidationFailedBeforeApiCall(`${codec} Decode error with payload ${JSON.stringify(rawFormValues, null, 2)}`);
};
