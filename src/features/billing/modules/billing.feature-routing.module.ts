import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingLayout } from '../layouts';
import { MedicalBillingPage, StandardBillingPage } from '../pages';
import { redirectWithDate } from '../guards/redirect-with-date.guard';
import { setDate } from '../guards/set-date.guard';

const ROUTES: Routes = [
  {
    path: '',
    component: BillingLayout,
    children: [
      {
        path: 'medical',
        canActivate: [redirectWithDate],
        component: MedicalBillingPage
      },
      {
        path: 'medical/:date',
        canActivate: [setDate],
        component: MedicalBillingPage
      },
      {
        path: 'standard',
        canActivate: [redirectWithDate],
        component: StandardBillingPage
      },
      {
        path: 'standard/:date',
        canActivate: [setDate],
        component: StandardBillingPage
      },
      { path: '**', redirectTo: 'medical', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class BillingFeatureRoutingModule {}
