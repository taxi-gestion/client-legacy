import { string as ioString, Type, type as ioType } from 'io-ts';
import { PredictRecurrence } from '../definitions';

export const predictRecurrenceCodec: Type<PredictRecurrence> = ioType(
  {
    query: ioString
  },
  'predictRecurrenceCodec'
);
