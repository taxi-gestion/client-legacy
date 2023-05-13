export const NO_USERNAME_ERROR_NAME: string = 'noUsernameError';

export const isNoUsernameError = (error: Error): error is NoUsernameError => error.name === NO_USERNAME_ERROR_NAME;

export class NoUsernameError extends Error {
  public override readonly name: string = NO_USERNAME_ERROR_NAME;

  public constructor() {
    super('Username is required');
  }
}
