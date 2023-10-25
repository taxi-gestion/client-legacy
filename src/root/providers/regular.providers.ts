import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  deleteRegularActionProvider,
  editRegularActionProvider,
  registerRegularActionProvider,
  regularHistoryQueryProvider,
  searchRegularQueryProvider,
  searchRegularsQuery$,
  validatedDeleteRegularAction$,
  validatedEditRegularAction$,
  validatedRegisterRegularAction$
} from '@features/regular';
import { searchPlaceQuery$, searchPlaceQueryProvider } from '@features/common/place';
import { regularHistoryQuery$ } from '../../features/regular/queries/regular-history';

export const REGULAR_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  deleteRegularActionProvider(validatedDeleteRegularAction$, [HttpClient]),
  editRegularActionProvider(validatedEditRegularAction$, [HttpClient]),
  registerRegularActionProvider(validatedRegisterRegularAction$, [HttpClient]),
  searchRegularQueryProvider(searchRegularsQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient]),
  regularHistoryQueryProvider(regularHistoryQuery$, [HttpClient])
];
