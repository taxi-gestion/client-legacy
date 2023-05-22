import { HttpClient } from '@angular/common/http';
import { FactoryProvider } from '@angular/core';
import { faresByDayRead$, faresByDayReadProvider } from '@features/planning';

export const PLANNING_PROVIDERS: FactoryProvider[] = [faresByDayReadProvider(faresByDayRead$, [HttpClient])];
