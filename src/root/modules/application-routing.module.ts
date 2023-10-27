import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthenticationFeatureModule,
  CanMatchGuestGuard,
  CanMatchLoggedInGuard,
  CanMatchOneUserGroupGuard,
  CanMatchRefreshTokenGuard
} from '@features/authentication';
import { cognitoAuthenticationProviders } from '@features/aws';
import { PublicFeatureModule } from '@features/public';
import { MainLayout } from '../layouts';
import { REGULAR_PROVIDERS, BILLING_PROVIDERS, PLANNING_PROVIDERS } from '../providers';
import { DashboardFeatureModule } from '@features/dashboard';
import { RegularFeatureModule } from '@features/regular';
import { BillingFeatureModule } from '@features/billing';
import { FareFeatureModule } from '../../features/fare';
import { FARE_PROVIDERS } from '../providers/fare.providers';
import { PlanningFeatureModule } from '@features/planning';
import { SupervisionFeatureModule } from '../../features/supervision';
import { SUPERVISION_PROVIDERS } from '../providers/supervision.providers';

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
    path: 'dashboard',
    canMatch: [CanMatchRefreshTokenGuard, CanMatchLoggedInGuard]
  },
  {
    loadChildren: async (): Promise<typeof RegularFeatureModule> => (await import('@features/regular')).RegularFeatureModule,
    component: MainLayout,
    path: 'regular',
    canMatch: [CanMatchRefreshTokenGuard, CanMatchLoggedInGuard, CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    providers: [...REGULAR_PROVIDERS]
  },
  {
    loadChildren: async (): Promise<typeof FareFeatureModule> => (await import('@features/fare')).FareFeatureModule,
    component: MainLayout,
    path: 'fare',
    canMatch: [CanMatchRefreshTokenGuard, CanMatchLoggedInGuard, CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager'] },
    providers: [...FARE_PROVIDERS]
  },
  {
    loadChildren: async (): Promise<typeof BillingFeatureModule> => (await import('@features/billing')).BillingFeatureModule,
    component: MainLayout,
    path: 'billing',
    canMatch: [CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['developer', 'manager', 'billing'] },
    providers: [...BILLING_PROVIDERS]
  },
  {
    loadChildren: async (): Promise<typeof SupervisionFeatureModule> =>
      (await import('@features/supervision')).SupervisionFeatureModule,
    component: MainLayout,
    path: 'supervision',
    canMatch: [CanMatchRefreshTokenGuard, CanMatchLoggedInGuard, CanMatchOneUserGroupGuard],
    data: { allowedGroups: ['manager'] },
    providers: [...SUPERVISION_PROVIDERS]
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
    providers: [...cognitoAuthenticationProviders()]
  },
  { path: '**', pathMatch: 'full', redirectTo: '/dashboard' }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot([...ROUTES])]
})
export class ApplicationRoutingModule {}
