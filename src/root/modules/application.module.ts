import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

@NgModule({
  declarations: [...LAYOUTS, ...COMPONENTS],
  imports: [BrowserAnimationsModule, HttpClientModule, ApplicationRoutingModule],
  bootstrap: [ApplicationRootLayout],
  providers: [
    CanMatchGuestGuard,
    CanMatchLoggedInGuard,
    CanMatchRefreshTokenGuard,
    CanMatchOneUserGroupGuard,
    ...applicationProviders()
  ]
})
export class ApplicationModule {}
