import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ClassProvider } from '@angular/core';
import { BearerTokenInterceptor } from './bearer-token.interceptor';

export const bearerTokenInterceptorProvider = (): ClassProvider => ({
  provide: HTTP_INTERCEPTORS,
  useClass: BearerTokenInterceptor,
  multi: true
});
