export const INVALID_USERNAME_OR_PASSWORD_ERROR_NAME: string = 'invalidUsernameOrPasswordError';

export class InvalidUsernameOrPasswordError extends Error {
  public override readonly name: string = INVALID_USERNAME_OR_PASSWORD_ERROR_NAME;

  public constructor() {
    super('Invalid username or password');
  }
}
