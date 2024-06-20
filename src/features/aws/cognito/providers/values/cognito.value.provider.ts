import { ValueProvider } from '@angular/core';

export type Cognito = {
  region: string;
  clientId: string;
};

export const COGNITO_PERSISTENCE: { key: symbol } = { key: Symbol('aws.cognito.persistence') };

export const cognitoValueProvider = (useValue: Cognito): ValueProvider => ({
  useValue,
  provide: COGNITO_PERSISTENCE
});
