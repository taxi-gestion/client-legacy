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
        title: '__PROJECT - Connexion',
        data: { animation: 'LoginPage' }
      },
      {
        component: RegisterPage,
        path: 'register',
        title: '__PROJECT - Créez votre compte',
        data: { animation: 'RegisterPage' }
      },
      {
        component: ForgotPasswordPage,
        path: 'forgot-password',
        title: '__PROJECT - Mot de passe oublié',
        data: { animation: 'ForgotPasswordPage' }
      },
      {
        component: ResetPasswordPage,
        path: 'reset-password',
        title: '__PROJECT - Réinitialisation du mot de passe',
        data: { animation: 'ResetPasswordPage' }
      },
      {
        component: ActivatePage,
        path: 'activate',
        title: '__PROJECT - Activation de votre compte',
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
