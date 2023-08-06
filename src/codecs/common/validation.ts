import { Type, Validation } from 'io-ts';

export const externalTypeCheckFor =
  <ToValidate>(codecForType: Type<ToValidate>) =>
  (transfer: unknown): Validation<ToValidate> =>
    codecForType.decode(transfer);
