import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  deleteRegularActionProvider,
  editRegularActionProvider,
  patchRegularActionProvider,
  registerRegularActionProvider,
  regularHistoryQueryProvider,
  searchRegularQueryProvider,
  searchRegularsQuery$,
  validatedDeleteRegularAction$,
  validatedEditRegularAction$,
  validatedRegisterRegularAction$,
  regularHistoryQuery$,
  patchRegularAction$
} from '@features/regular';
import { searchPlaceQuery$, searchPlaceQueryProvider } from '@features/common/place';

export const REGULAR_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  deleteRegularActionProvider(validatedDeleteRegularAction$, [HttpClient]),
  editRegularActionProvider(validatedEditRegularAction$, [HttpClient]),
  patchRegularActionProvider(patchRegularAction$, [HttpClient]),
  registerRegularActionProvider(validatedRegisterRegularAction$, [HttpClient]),
  searchRegularQueryProvider(searchRegularsQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient]),
  regularHistoryQueryProvider(regularHistoryQuery$, [HttpClient])
];
