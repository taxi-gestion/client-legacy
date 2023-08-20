import { Entity } from '@domain';

export type User = Entity & {
  identifier: string;
  username: string;
};
