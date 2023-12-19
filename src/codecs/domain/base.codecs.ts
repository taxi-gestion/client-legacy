// eslint-disable-next-line @typescript-eslint/naming-convention
import { Kind, Nature } from '../../definitions';
import { keyof as ioKeyOf, Type } from 'io-ts';
// eslint-disable-next-line @typescript-eslint/naming-convention
export const kindCodec: Type<Kind> = ioKeyOf({ 'one-way': null, 'two-way': null });
export const natureCodec: Type<Nature> = ioKeyOf({ medical: null, standard: null });
