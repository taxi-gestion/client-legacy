import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { isDevMode, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CanMatchGuestGuard,
  CanMatchLoggedInGuard,
  CanMatchOneUserGroupGuard,
  CanMatchRefreshTokenGuard
} from '../../features/authentication';
import { COMPONENTS, NavbarUiModule, ToasterModule } from '../components';
import { ApplicationRootLayout, LAYOUTS } from '../layouts';
import { applicationProviders } from '../providers';
import { ApplicationRoutingModule } from './application-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';

registerLocaleData(localeFr);

@NgModule({
  declarations: [...LAYOUTS, ...COMPONENTS],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    ApplicationRoutingModule,
    NavbarUiModule,
    ToasterModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(), // !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  bootstrap: [ApplicationRootLayout],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    CanMatchGuestGuard,
    CanMatchLoggedInGuard,
    CanMatchRefreshTokenGuard,
    CanMatchOneUserGroupGuard,
    ...applicationProviders()
  ]
})
export class ApplicationModule {}
