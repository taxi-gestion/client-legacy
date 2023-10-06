import { isMedicalDrive } from './fare.presenter';
import { Nature } from '@definitions';

describe('fare presenter', (): void => {
  it.each([
    ['standard' as const, false],
    ['medical' as const, true]
  ])('isMedicalDrive should return %s for %s', (nature: Nature['nature'], expectedResult: boolean): void => {
    expect(isMedicalDrive(nature)).toBe(expectedResult);
  });
});
