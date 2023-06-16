import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleFarePage, DailyPage } from '../pages';

const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DailyPage
      },
      {
        path: ':date',
        component: DailyPage
      },
      {
        path: 'schedule',
        component: ScheduleFarePage
      }
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class PlanningFeatureRoutingModule {}
