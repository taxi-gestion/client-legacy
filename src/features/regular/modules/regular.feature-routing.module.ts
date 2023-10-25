import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditRegularPage, RegisterRegularPage, RegularHistoryPage } from '../pages';
import { ManageRegularLayout } from '../layouts';

const ROUTES: Routes = [
  {
    path: '',
    component: ManageRegularLayout
  },
  {
    path: 'edit',
    component: EditRegularPage
  },
  {
    path: 'register',
    component: RegisterRegularPage
  },
  {
    path: 'history',
    component: RegularHistoryPage
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class RegularFeatureRoutingModule {}
