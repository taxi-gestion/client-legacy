export const REMOTE_SERVICE_UNAVAILABLE_ERROR_NAME: string = 'remoteServiceUnavailableError';

export class RemoteServiceUnavailable extends Error {
  public override readonly name: string = REMOTE_SERVICE_UNAVAILABLE_ERROR_NAME;
}
