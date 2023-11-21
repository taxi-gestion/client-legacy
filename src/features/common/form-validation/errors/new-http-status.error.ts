export const NEW_HTTP_STATUS_ERROR_NAME: string = 'newHttpStatusError';

export class NewHttpStatus extends Error {
  public override readonly name: string = NEW_HTTP_STATUS_ERROR_NAME;
}
