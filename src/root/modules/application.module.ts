import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CanMatchGuestGuard,
  CanMatchLoggedInGuard,
  CanMatchOneUserGroupGuard,
  CanMatchRefreshTokenGuard
} from '@features/authentication';
import { COMPONENTS, NavbarUiModule } from '../components';
import { ApplicationRootLayout, LAYOUTS } from '../layouts';
import { applicationProviders } from '../providers';
import { ApplicationRoutingModule } from './application-routing.module';

registerLocaleData(localeFr);

@NgModule({
  declarations: [...LAYOUTS, ...COMPONENTS],
  imports: [BrowserAnimationsModule, HttpClientModule, ApplicationRoutingModule, NavbarUiModule],
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
