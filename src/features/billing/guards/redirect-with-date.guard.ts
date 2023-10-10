import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { DateService } from '../../common/date/services/date.service';
import { format } from 'date-fns';

// TODO Solve how to declare / inject this properly
export const redirectWithDate: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UrlTree =>
  inject(Router).parseUrl(`${state.url}/${format(inject(DateService).date(), 'yyyy-MM-dd')}`);
