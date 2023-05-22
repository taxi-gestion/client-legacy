import { HttpClient } from '@angular/common/http';
import { ClassProvider, FactoryProvider, ValueProvider } from '@angular/core';
import {
  bearerTokenInterceptorProvider,
  logoutActionProvider,
  RedirectRoutesKeys,
  redirectRoutesValueProvider,
  refreshTokenActionProvider,
  refreshTokenInterceptorProvider,
  SESSION_PERSISTENCE,
  sessionValueProvider
} from '@features/authentication';
import {
  COGNITO_PERSISTENCE,
  cognitoLogoutAction,
  cognitoRefreshTokenAction$,
  cognitoTokenSession,
  cognitoValueProvider
} from '@features/aws';
import { ENV } from '../../environments';

const redirectToRoutes: Map<RedirectRoutesKeys, string> = new Map<RedirectRoutesKeys, string>([
  ['activate', '/login'],
  ['register', '/activate'],
  ['not-activated', '/activate'],
  ['login', '/'],
  ['logout', '/'],
  ['session-expired', '/login'],
  ['forgot-password', '/reset-password'],
  ['reset-password', '/login']
]);

export const APPLICATION_PROVIDERS: (ClassProvider | FactoryProvider | ValueProvider)[] = [
  cognitoValueProvider({ clientId: ENV.auth.clientId, region: 'us-east-1' }),
  sessionValueProvider(cognitoTokenSession()),
  redirectRoutesValueProvider(redirectToRoutes),
  logoutActionProvider(cognitoLogoutAction, [SESSION_PERSISTENCE]),
  refreshTokenActionProvider(cognitoRefreshTokenAction$, [HttpClient, COGNITO_PERSISTENCE, SESSION_PERSISTENCE]),
  refreshTokenInterceptorProvider(),
  bearerTokenInterceptorProvider()
];
