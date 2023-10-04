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
import { PlanningFeatureModule } from '@features/planning';
import { PublicFeatureModule } from '@features/public';
import { MainLayout } from '../layouts';
import { PLANNING_PROVIDERS } from '../providers';
import { DashboardFeatureModule } from '@features/dashboard';
import { RegularFeatureModule } from '@features/regular';
import { REGULAR_PROVIDERS } from '../providers/regular.providers';

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
  { path: '**', pathMatch: 'full', redirectTo: '/planning' }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot([...ROUTES])]
})
export class ApplicationRoutingModule {}
