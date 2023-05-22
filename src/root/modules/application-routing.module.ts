import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthenticationFeatureModule,
  CanMatchGuestGuard,
  CanMatchLoggedInGuard,
  CanMatchRefreshTokenGuard
} from '@features/authentication';
import { DashboardFeatureModule } from '@features/dashboard';
import { PlanningFeatureModule } from '@features/planning';
import { PublicFeatureModule } from '@features/public';
import { MainLayout } from '../layouts';
import { AUTHENTICATION_PROVIDERS, PLANNING_PROVIDERS } from '../providers';

const ROUTES: Routes = [
  {
    loadChildren: async (): Promise<typeof PlanningFeatureModule> => (await import('@features/planning')).PlanningFeatureModule,
    component: MainLayout,
    path: 'planning',
    canMatch: [CanMatchRefreshTokenGuard, CanMatchLoggedInGuard],
    providers: [...PLANNING_PROVIDERS]
  },
  {
    loadChildren: async (): Promise<typeof DashboardFeatureModule> =>
      (await import('@features/dashboard')).DashboardFeatureModule,
    component: MainLayout,
    path: '',
    canMatch: [CanMatchRefreshTokenGuard, CanMatchLoggedInGuard]
  },
  {
    loadChildren: async (): Promise<typeof PublicFeatureModule> => (await import('@features/public')).PublicFeatureModule,
    path: '',
    canMatch: [CanMatchGuestGuard]
  },
  {
    loadChildren: async (): Promise<typeof AuthenticationFeatureModule> =>
      (await import('@features/authentication')).AuthenticationFeatureModule,
    path: '',
    canMatch: [CanMatchGuestGuard],
    providers: [...AUTHENTICATION_PROVIDERS]
  },
  { path: '**', pathMatch: 'full', redirectTo: '/' }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot([...ROUTES])]
})
export class ApplicationRoutingModule {}
