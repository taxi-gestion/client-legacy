import { describe, it, expect } from 'vitest';
import { format } from 'date-fns';
import { routeParamToDateString } from './date.presenter';
import { Params } from '@angular/router';

describe('paramsToDateDayString', (): void => {
  it.each([
    [{ date: '2023-09-22' }, '2023-09-22'], // Valid date string
    [{ date: '2023-13-22' }, format(new Date(), 'yyyy-MM-dd')], // Invalid date string
    [{ date: null }, format(new Date(), 'yyyy-MM-dd')], // null date
    [{ date: undefined }, format(new Date(), 'yyyy-MM-dd')], // undefined date
    [{}, format(new Date(), 'yyyy-MM-dd')] // No date property
  ])('converts params to date string correctly', (params: Params, expectedResult: string): void => {
    expect(routeParamToDateString('date', params, new Date())).toBe(expectedResult);
  });
});
