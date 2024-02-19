import { FactoryProvider, ValueProvider } from '@angular/core';
import { driverFaresForDateQueryProvider } from '../../features/driver-pwa/providers';
import { driverFaresForDateForDateQuery$ } from '../../features/driver-pwa/queries';
import { HttpClient } from '@angular/common/http';

export const DRIVER_PWA_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  driverFaresForDateQueryProvider(driverFaresForDateForDateQuery$, [HttpClient])
];
