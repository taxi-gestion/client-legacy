import { NgModule } from '@angular/core';
import { PAGES } from '../pages';
import { PublicFeatureRoutingModule } from './public.feature-routing.module';

@NgModule({
  declarations: [...PAGES],
  imports: [PublicFeatureRoutingModule]
})
export class PublicFeatureModule {}
