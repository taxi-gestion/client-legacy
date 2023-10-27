import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportsPage } from '../pages';

const ROUTES: Routes = [
  {
    path: '',
    component: ExportsPage
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class SupervisionFeatureRoutingModule {}
