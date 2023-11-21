import { Encoder } from 'io-ts';

export const identityEncoder = <T>(): Encoder<T, T> => ({
  encode: (input: T): T => input
});

export const identityEncode = <T>(input: T): T => input;
