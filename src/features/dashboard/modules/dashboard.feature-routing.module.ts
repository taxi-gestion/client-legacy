import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from '../pages';
import { RedirectUsersByGroupGuard } from '../guards/redirect-users-by-group.guard';
import { MissingUserGroupPage } from '../pages/missing-user-group/missing-user-group.page';

const ROUTES: Routes = [
  {
    component: HomePage,
    path: '',
    canActivate: [RedirectUsersByGroupGuard]
  },
  {
    component: MissingUserGroupPage,
    path: 'missing-user-group'
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class DashboardFeatureRoutingModule {}
