import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFareToPlanningExperimentalPage, DailyPage } from '../pages';

const ROUTES: Routes = [
  {
    component: AddFareToPlanningExperimentalPage,
    path: 'experimental'
  },
  {
    component: DailyPage,
    path: ''
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class PlanningFeatureRoutingModule {}
