import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import { allRegularsQuery$, allRegularsQueryProvider } from '../../features/supervision';

export const SUPERVISION_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  allRegularsQueryProvider(allRegularsQuery$, [HttpClient])
];
