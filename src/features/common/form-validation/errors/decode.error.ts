export const DECODE_ERROR_NAME: string = 'decodeError';

export class DecodeError extends Error {
  public override readonly name: string = DECODE_ERROR_NAME;
}
