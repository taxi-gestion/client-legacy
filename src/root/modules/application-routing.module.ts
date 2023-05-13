import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { CanMatchGuestGuard, CanMatchLoggedInGuard, CanMatchRefreshTokenGuard } from '@features/authentication';
import { MainLayout } from '../layouts';
import { AUTHENTICATION_PROVIDERS, PLANNING_PROVIDERS } from '../providers';

const ROUTES: Routes = [
  {
    loadChildren: async () => (await import('@features/planning')).PlanningFeatureModule,
    component: MainLayout,
    path: 'planning',
    canMatch: [CanMatchRefreshTokenGuard, CanMatchLoggedInGuard],
    providers: [...PLANNING_PROVIDERS]
  },
  {
    loadChildren: async () => (await import('@features/dashboard')).DashboardFeatureModule,
    component: MainLayout,
    path: '',
    canMatch: [CanMatchRefreshTokenGuard, CanMatchLoggedInGuard]
  },
  {
    loadChildren: async () => (await import('@features/public')).PublicFeatureModule,
    path: '',
    canMatch: [CanMatchGuestGuard]
  },
  {
    loadChildren: async () => (await import('@features/authentication')).AuthenticationFeatureModule,
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
