import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PAGES } from '../pages';
import { DateModule } from '@features/common/date';
import { SupervisionFeatureRoutingModule } from './supervision.feature-routing.module';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...PAGES],
  exports: [],
  imports: [CommonModule, SupervisionFeatureRoutingModule, DateModule]
})
export class SupervisionFeatureModule {}
