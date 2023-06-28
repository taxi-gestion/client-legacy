import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyPage } from '../pages';
import { DriverAgendaPage } from '../pages/driver-agenda/driver-agenda-page.component';
import {CanMatchOneUserGroupGuard, CanMatchUserAttributeGuard} from '@features/authentication';
import { CanActivatePlanningRedirectGuard } from '../guards/can-activate-planning-redirect.guard';

const ROUTES: Routes = [
  {
    path: 'daily',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    component: DailyPage
  },
  {
    path: 'daily/:date',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    component: DailyPage
  },
  {
    path: 'agenda',
    canMatch: [CanMatchOneUserGroupGuard, CanMatchUserAttributeGuard],
    data: { allowedGroups: ['developer', 'driver'], userAttribute: 'custom:planning_identifier' },
    component: DriverAgendaPage
  },
  {
    path: 'agenda/:date',
    canMatch: [CanMatchOneUserGroupGuard, CanMatchUserAttributeGuard],
    data: { allowedGroups: ['developer', 'driver'], userAttribute: 'custom:planning_identifier' },
    component: DriverAgendaPage
  },
  {
    path: ':date',
    canActivate: [CanActivatePlanningRedirectGuard],
    children: []
  },
  {
    path: '',
    canActivate: [CanActivatePlanningRedirectGuard],
    children: []
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class PlanningFeatureRoutingModule {}
