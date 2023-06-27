import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadModule } from '@features/common';
import { DIRECTIVES } from '../directives';
import { LAYOUTS } from '../layouts';
import { PAGES } from '../pages';
import { COMPONENTS } from '../components';
import { PIPES } from '../pipes';
import { fieldErrorMessagesValueProvider } from '../providers';
import { ERROR_MESSAGES } from '../presentation';
import { AuthenticationFeatureRoutingModule } from './authentication.feature-routing.module';

@NgModule({
  declarations: [...DIRECTIVES, ...LAYOUTS, ...PAGES, ...COMPONENTS, ...PIPES],
  imports: [CommonModule, ReactiveFormsModule, LoadModule, AuthenticationFeatureRoutingModule],
  providers: [fieldErrorMessagesValueProvider(ERROR_MESSAGES)]
})
export class AuthenticationFeatureModule {}
