import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyExperimentalPage, DailyPage } from '../pages';

const ROUTES: Routes = [
  {
    component: DailyExperimentalPage,
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
