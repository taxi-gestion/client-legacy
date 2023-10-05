import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditRegularPage, RegisterRegularPage } from '../pages';
import { CanMatchOneUserGroupGuard } from '@features/authentication';
import { ManageRegularLayout } from '../layouts';

const ROUTES: Routes = [
  {
    path: '',
    component: ManageRegularLayout,
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    children: [
      {
        path: 'edit',
        component: EditRegularPage
      },
      {
        path: 'register',
        component: RegisterRegularPage
      },
      { path: '**', redirectTo: 'edit', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class RegularFeatureRoutingModule {}
