import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanMatchGuestGuard, CanMatchLoggedInGuard, CanMatchRefreshTokenGuard } from '@features/authentication';
import { COMPONENTS } from '../components';
import { ApplicationRootLayout, LAYOUTS } from '../layouts';
import { APPLICATION_PROVIDERS } from '../providers';
import { ApplicationRoutingModule } from './application-routing.module';

@NgModule({
  declarations: [...LAYOUTS, ...COMPONENTS],
  imports: [BrowserAnimationsModule, HttpClientModule, ApplicationRoutingModule],
  bootstrap: [ApplicationRootLayout],
  providers: [CanMatchGuestGuard, CanMatchLoggedInGuard, CanMatchRefreshTokenGuard, ...APPLICATION_PROVIDERS]
})
export class ApplicationModule {}
