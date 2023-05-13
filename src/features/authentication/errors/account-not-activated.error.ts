export const ACCOUNT_NOT_ACTIVATED_ERROR_NAME: string = 'accountNotActivatedError';

export const isAccountNotActivatedError = (error: Error): error is AccountNotActivatedError =>
  error.name === ACCOUNT_NOT_ACTIVATED_ERROR_NAME;

export class AccountNotActivatedError extends Error {
  public override readonly name: string = ACCOUNT_NOT_ACTIVATED_ERROR_NAME;

  public constructor(public readonly username: string) {
    super(`Account associated with ${username} has not been activated`);
  }
}
