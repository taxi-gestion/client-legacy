export const INVALID_CODE_ERROR_NAME: string = 'invalidCodeError';

export class InvalidCodeError extends Error {
  public override readonly name: string = INVALID_CODE_ERROR_NAME;

  public constructor(public readonly code: string) {
    super(`The code ${code} is invalid`);
  }
}
