export const WRONG_PASSWORD_ERROR_NAME: string = 'wrongPasswordError';

export class WrongPasswordError extends Error {
  public override readonly name: string = WRONG_PASSWORD_ERROR_NAME;

  public constructor(public readonly username: string) {
    super(`Wrong password for ${username}`);
  }
}
