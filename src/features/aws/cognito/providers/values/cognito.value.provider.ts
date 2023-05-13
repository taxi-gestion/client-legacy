import { ValueProvider } from '@angular/core';

export type Cognito = {
  region: string;
  clientId: string;
};

export const COGNITO_PERSISTENCE = 'aws.cognito.persistence' as const;

export const cognitoValueProvider = (useValue: Cognito): ValueProvider => ({
  useValue,
  provide: COGNITO_PERSISTENCE
});
