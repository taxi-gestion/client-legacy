import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { DateService } from '../../common/date/services/date.service';

// TODO Solve how to declare / inject this properly
export const setDate: CanActivateFn = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): true => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unnecessary-type-assertion
  inject(DateService).setDate(new Date(route.params['date']!));
  return true;
};
