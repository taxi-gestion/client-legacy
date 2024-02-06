import { describe, it, expect } from 'vitest';
import { WithNature } from '@definitions';
import { isMedicalDrive } from './fare.presenter.pure';

describe('fare presenter', (): void => {
  it.each([
    ['standard' as const, false],
    ['medical' as const, true]
  ])('isMedicalDrive should return %s for %s', (nature: WithNature['nature'], expectedResult: boolean): void => {
    expect(isMedicalDrive(nature)).toBe(expectedResult);
  });
});
