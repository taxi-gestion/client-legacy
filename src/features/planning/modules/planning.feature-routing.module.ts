import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleFarePage, DailyPage } from '../pages';
import { DailyDriverPage } from '../pages/daily-driver/daily-driver.page';

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
        path: ':planning',
        component: DailyDriverPage
      },
      {
        path: ':planning/:date',
        component: DailyDriverPage
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
