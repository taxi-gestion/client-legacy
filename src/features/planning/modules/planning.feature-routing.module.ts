import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanMatchOneUserGroupGuard } from '@features/authentication';
import { DriverAgendaPage } from '../pages';
import { ManagerDriverAgendaPage } from '../pages/manager-driver-agenda/manager-driver-agenda.page';
import { DailyPlanningListLayout } from '../layouts/daily-planning-list/daily-planning-list.layout';

const ROUTES: Routes = [
  {
    path: 'daily-list',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    component: DailyPlanningListLayout
  },
  {
    path: 'daily-list/:date',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    component: DailyPlanningListLayout
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
    path: 'agenda-manager',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    component: ManagerDriverAgendaPage
  },
  {
    path: 'agenda-manager/:date',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    component: ManagerDriverAgendaPage
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class PlanningFeatureRoutingModule {}
