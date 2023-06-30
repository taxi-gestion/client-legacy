import { FactoryProvider } from '@angular/core';
import { inMemoryForgotPasswordAction$, inMemoryLoginAction$, inMemoryRegisterAction$ } from '../actions';
import { forgotPasswordActionProvider, loginActionProvider, registerActionProvider } from './actions';
import { ACCOUNTS_PERSISTENCE, SESSION_PERSISTENCE } from './values';

export const inMemoryAuthenticationProviders: () => FactoryProvider[] = (): FactoryProvider[] => [
  forgotPasswordActionProvider(inMemoryForgotPasswordAction$, [ACCOUNTS_PERSISTENCE]),
  loginActionProvider(inMemoryLoginAction$, [ACCOUNTS_PERSISTENCE, SESSION_PERSISTENCE]),
  registerActionProvider(inMemoryRegisterAction$, [ACCOUNTS_PERSISTENCE])
];
