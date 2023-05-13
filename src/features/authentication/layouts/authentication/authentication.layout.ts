import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { slideInAnimation } from '../../animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    slideInAnimation([
      ['LoginPage', 'ForgotPasswordPage'],
      ['LoginPage', 'ResetPasswordPage'],
      ['LoginPage', 'RegisterPage'],
      ['LoginPage', 'ActivatePage'],
      ['RegisterPage', 'LoginPage'],
      ['RegisterPage', 'ActivatePage'],
      ['ActivatePage', 'LoginPage'],
      ['ForgotPasswordPage', 'LoginPage'],
      ['ForgotPasswordPage', 'ResetPasswordPage']
    ])
  ],
  templateUrl: './authentication.layout.html'
})
export class AuthenticationLayout {
  public readonly currentYear: number = new Date().getFullYear();

  public constructor(private readonly _contexts: ChildrenOutletContexts) {}

  public getRouteAnimationData(): string {
    return this._contexts.getContext('primary')?.route?.snapshot.data?.['animation'];
  }
}
