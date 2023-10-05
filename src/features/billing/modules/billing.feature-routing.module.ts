import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingLayout } from '../layouts';
import { MedicalBillingPage, StandardBillingPage } from '../pages';

const ROUTES: Routes = [
  {
    path: '',
    component: BillingLayout,
    children: [
      {
        path: 'medical',
        component: MedicalBillingPage
      },
      {
        path: 'medical/:date',
        component: MedicalBillingPage
      },
      {
        path: 'standard',
        component: StandardBillingPage
      },
      {
        path: 'standard/:date',
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
