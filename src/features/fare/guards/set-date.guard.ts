import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { DateService } from '../../common/date/services/date.service';

export const setDate: CanActivateFn = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): true => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-unsafe-argument
  inject(DateService).setDate(new Date(route.params['date']!));
  return true;
};
