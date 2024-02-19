import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanMatchOneUserGroupGuard } from '@features/authentication';
import { DriverHomePage, DriverAgendaPage } from '../pages';

const ROUTES: Routes = [
  {
    path: 'agenda',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager', 'driver'] },
    component: DriverAgendaPage
  },
  {
    path: '',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager', 'driver'] },
    component: DriverHomePage
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class DriverPwaFeatureRoutingModule {}
