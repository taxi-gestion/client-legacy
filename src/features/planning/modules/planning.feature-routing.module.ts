import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanMatchOneUserGroupGuard } from '@features/authentication';
import { DailyPlanningLayout } from '../layouts';
import {
  AffectReturnPage,
  DriverAgendaPage,
  ManagerDriverChoicePage,
  MissingAdminConfigurationPage,
  ScheduleFarePage
} from '../pages';
import { CanActivatePlanningRedirectGuard } from '../guards';

const DAILY_PAGES: Routes = [
  {
    path: 'schedule-fare',
    component: ScheduleFarePage
  },
  {
    path: 'affect-return',
    component: AffectReturnPage
  }
];

const ROUTES: Routes = [
  {
    path: 'planning-or-agenda',
    component: ManagerDriverChoicePage
  },
  {
    path: 'missing-admin-configuration',
    component: MissingAdminConfigurationPage
  },
  {
    path: 'daily',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    children: DAILY_PAGES,
    component: DailyPlanningLayout
  },
  {
    path: 'daily/:date',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    children: DAILY_PAGES,
    component: DailyPlanningLayout
  },
  {
    path: 'agenda',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'driver'] },
    component: DriverAgendaPage
  },
  {
    path: 'agenda/:date',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'driver'] },
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
