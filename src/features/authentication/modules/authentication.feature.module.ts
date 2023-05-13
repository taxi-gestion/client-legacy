import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule, AuthenticationFeatureRoutingModule],
  providers: [fieldErrorMessagesValueProvider(ERROR_MESSAGES)]
})
export class AuthenticationFeatureModule {}
