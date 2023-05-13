import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ClassProvider } from '@angular/core';
import { RefreshTokenInterceptor } from './refresh-token.interceptor';

export const refreshTokenInterceptorProvider = (): ClassProvider => ({
  provide: HTTP_INTERCEPTORS,
  useClass: RefreshTokenInterceptor,
  multi: true
});
