import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyPage } from '../pages';
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
