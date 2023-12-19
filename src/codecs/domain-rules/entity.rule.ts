import { type as ioType } from 'io-ts';
import { isUUIDString } from '../rules/isUuid.rule';

// eslint-disable-next-line @typescript-eslint/typedef
export const entityRule = ioType(
  {
    id: isUUIDString
  },
  'entityRule'
);
