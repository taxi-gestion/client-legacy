import type { Session } from '@features/authentication';

export const inMemorySession = (): Session => ({
  isLoggedIn: false,
  accessToken: (): string | null => 'access-token',
  idToken: (): string | null => 'id-token',
  refresh: (): string | null => 'refresh-token',
  expiresIn: (): number => NaN,
  remainingTime: (): number => 1000,
  username: (): string => 'alfred.martin',
  userId: (): string => 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  groups: (): string[] => ['admin']
});
