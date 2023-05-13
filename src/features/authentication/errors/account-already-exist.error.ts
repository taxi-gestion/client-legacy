export const ACCOUNT_ALREADY_EXIST_ERROR_NAME: string = 'accountAlreadyExistError';

export class AccountAlreadyExistError extends Error {
  public override readonly name: string = ACCOUNT_ALREADY_EXIST_ERROR_NAME;

  public constructor(public readonly username: string) {
    super(`Username ${username} already exist`);
  }
}
