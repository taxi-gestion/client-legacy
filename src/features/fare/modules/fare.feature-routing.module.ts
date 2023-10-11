import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditFarePage, ScheduleFarePage } from '../pages';
import { CanMatchOneUserGroupGuard } from '@features/authentication';
import { ManageFareLayout } from '../layouts';
import { redirectWithDate } from '../guards/redirect-with-date.guard';
import { setDate } from '../guards/set-date.guard';

const ROUTES: Routes = [
  {
    path: '',
    component: ManageFareLayout,
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] }
  },
  {
    path: 'edit',
    canActivate: [redirectWithDate],
    component: EditFarePage
  },
  {
    path: 'schedule',
    canActivate: [redirectWithDate],
    component: ScheduleFarePage
  },
  {
    path: 'edit/:date',
    canActivate: [setDate],
    component: EditFarePage
  },
  {
    path: 'schedule/:date',
    canActivate: [setDate],
    component: ScheduleFarePage
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class FareFeatureRoutingModule {}
