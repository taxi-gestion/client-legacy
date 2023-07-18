import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import {
  CanMatchGuestGuard,
  CanMatchLoggedInGuard,
  CanMatchOneUserGroupGuard,
  CanMatchRefreshTokenGuard
} from '@features/authentication';
import { COMPONENTS } from '../components';
import { ApplicationRootLayout, LAYOUTS } from '../layouts';
import { applicationProviders } from '../providers';
import { ApplicationRoutingModule } from './application-routing.module';

registerLocaleData(localeFr);

@NgModule({
  declarations: [...LAYOUTS, ...COMPONENTS],
  imports: [BrowserAnimationsModule, HttpClientModule, ApplicationRoutingModule],
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
