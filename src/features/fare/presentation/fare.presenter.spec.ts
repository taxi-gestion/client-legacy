import { isMedicalDrive } from './fare.presenter';
import { WithNature } from '@definitions';

describe('fare presenter', (): void => {
  it.each([
    ['standard' as const, false],
    ['medical' as const, true]
  ])('isMedicalDrive should return %s for %s', (nature: WithNature['nature'], expectedResult: boolean): void => {
    expect(isMedicalDrive(nature)).toBe(expectedResult);
  });
});
