import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationLayout } from '../layouts';
import { ActivatePage, ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage } from '../pages';

const ROUTES: Routes = [
  {
    children: [
      {
        component: LoginPage,
        path: 'login',
        title: 'taxi-gestion - Connexion',
        data: { animation: 'LoginPage' }
      },
      {
        component: RegisterPage,
        path: 'register',
        title: 'taxi-gestion - Créez votre compte',
        data: { animation: 'RegisterPage' }
      },
      {
        component: ForgotPasswordPage,
        path: 'forgot-password',
        title: 'taxi-gestion - Mot de passe oublié',
        data: { animation: 'ForgotPasswordPage' }
      },
      {
        component: ResetPasswordPage,
        path: 'reset-password',
        title: 'taxi-gestion - Réinitialisation du mot de passe',
        data: { animation: 'ResetPasswordPage' }
      },
      {
        component: ActivatePage,
        path: 'activate',
        title: 'taxi-gestion - Activation de votre compte',
        data: { animation: 'ActivatePage' }
      }
    ],
    component: AuthenticationLayout,
    path: ''
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class AuthenticationFeatureRoutingModule {}
