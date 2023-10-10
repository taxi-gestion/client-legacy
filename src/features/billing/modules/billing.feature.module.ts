import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BillingFeatureRoutingModule } from './billing.feature-routing.module';
import { LAYOUTS } from '../layouts';
import { COMPONENTS } from '../components';
import { PAGES } from '../pages';
import { DateModule } from '@features/common/date';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...LAYOUTS, ...COMPONENTS, ...PAGES],
  exports: [],
  imports: [CommonModule, BillingFeatureRoutingModule, DateModule]
})
export class BillingFeatureModule {}
