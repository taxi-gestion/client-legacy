import { HttpClient } from '@angular/common/http';
import { faresByDayRead$, faresByDayReadProvider } from '@features/planning';

export const PLANNING_PROVIDERS = [faresByDayReadProvider(faresByDayRead$, [HttpClient])];
