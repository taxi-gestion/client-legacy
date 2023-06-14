import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleFareExperimentalPage, DailyPage } from '../pages';

const ROUTES: Routes = [
  {
    component: ScheduleFareExperimentalPage,
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
