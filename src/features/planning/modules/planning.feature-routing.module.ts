import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanMatchOneUserGroupGuard } from '@features/authentication';
import { DailyPlanningLayout } from '../layouts';
import {
  DriverAgendaPage,
  ManageFarePage,
  ManagePendingPage,
  ManagerDriverChoicePage,
  ManageRegularPage,
  MissingAdminConfigurationPage,
  RegisterRegularPage,
  ScheduleFarePage
} from '../pages';
import { CanActivatePlanningRedirectGuard } from '../guards';
import { ManagerDriverAgendaPage } from '../pages/manager-driver-agenda/manager-driver-agenda.page';
import { DailyPlanningListLayout } from '../layouts/daily-planning-list/daily-planning-list.layout';

const DAILY_PAGES: Routes = [
  {
    path: 'manage-fare',
    component: ManageFarePage
  },
  {
    path: 'manage-regular',
    component: ManageRegularPage
  },
  {
    path: 'register-regular',
    component: RegisterRegularPage
  },
  {
    path: 'schedule-fare',
    component: ScheduleFarePage
  },
  {
    path: 'manage-pending',
    component: ManagePendingPage
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
    path: 'daily-list',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    children: DAILY_PAGES,
    component: DailyPlanningListLayout
  },
  {
    path: 'daily-list/:date',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    children: DAILY_PAGES,
    component: DailyPlanningListLayout
  },
  {
    path: 'agenda',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'driver'] },
    component: DriverAgendaPage
  },
  {
    path: 'agenda-manager',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    component: ManagerDriverAgendaPage
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
