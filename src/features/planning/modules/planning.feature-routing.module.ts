import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleFarePage, DailyPage } from '../pages';
import { DriverAgendaPage } from '../pages/driver-agenda/driver-agenda-page.component';

const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DailyPage
      },
      {
        path: 'schedule',
        component: ScheduleFarePage
      },
      {
        path: ':date',
        component: DailyPage
      },
      {
        path: ':planning',
        component: DriverAgendaPage
      },
      {
        path: ':planning/:date',
        component: DriverAgendaPage
      }
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class PlanningFeatureRoutingModule {}
