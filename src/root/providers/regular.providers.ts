import { HttpClient } from '@angular/common/http';
import { FactoryProvider, ValueProvider } from '@angular/core';
import {
  deleteRegularActionProvider,
  editRegularActionProvider,
  registerRegularActionProvider,
  validatedDeleteRegularAction$,
  validatedEditRegularAction$,
  validatedRegisterRegularAction$
} from '@features/regular';
import { searchRegularQueryProvider, searchRegularsQuery$ } from '@features/common/regular';
import { searchPlaceQuery$, searchPlaceQueryProvider } from '@features/common/place';

export const REGULAR_PROVIDERS: (FactoryProvider | ValueProvider)[] = [
  deleteRegularActionProvider(validatedDeleteRegularAction$, [HttpClient]),
  editRegularActionProvider(validatedEditRegularAction$, [HttpClient]),
  registerRegularActionProvider(validatedRegisterRegularAction$, [HttpClient]),
  searchRegularQueryProvider(searchRegularsQuery$, [HttpClient]),
  searchPlaceQueryProvider(searchPlaceQuery$, [HttpClient])
];
