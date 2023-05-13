import { isPhone, toInternationalFormat } from './phone.presenter';

describe('phone validator', (): void => {
  it('should not validate empty string as phone number', (): void => {
    const isValid: boolean = isPhone('');

    expect(isValid).toBe(false);
  });

  it('should not validate as phone number with missing digit', (): void => {
    const isValid: boolean = isPhone('061286458');

    expect(isValid).toBe(false);
  });

  it('should validate 0612864587 as phone number', (): void => {
    const isValid: boolean = isPhone('0612864587');

    expect(isValid).toBe(true);
  });

  it('should validate phone number with space separators', (): void => {
    const isValid: boolean = isPhone('06 12 86 45 87');

    expect(isValid).toBe(true);
  });

  it('should validate phone number with dot separators', (): void => {
    const isValid: boolean = isPhone('06.12.86.45.87');

    expect(isValid).toBe(true);
  });

  it('should validate phone number with international + format', (): void => {
    const isValid: boolean = isPhone('+33612864587');

    expect(isValid).toBe(true);
  });

  it('should validate phone number with international + format and optional 0', (): void => {
    const isValid: boolean = isPhone('+33(0)612864587');

    expect(isValid).toBe(true);
  });

  it('should validate phone number with international 00 format', (): void => {
    const isValid: boolean = isPhone('0033612864587');

    expect(isValid).toBe(true);
  });

  it('should non format phone if username is email', (): void => {
    const formattedPhone: string = toInternationalFormat('test@taxi-gestion.com');

    expect(formattedPhone).toBe('test@taxi-gestion.com');
  });

  it('should format phone by adding missing french international prefix', (): void => {
    const formattedPhone: string = toInternationalFormat('0614863215');

    expect(formattedPhone).toBe('+33614863215');
  });

  it('should format phone by fixing french international prefix', (): void => {
    const formattedPhone: string = toInternationalFormat('0033614863745');

    expect(formattedPhone).toBe('+33614863745');
  });

  it('should format phone by removing unexpected chars', (): void => {
    const formattedPhone: string = toInternationalFormat('06-14-86-37-45');

    expect(formattedPhone).toBe('+33614863745');
  });
});
