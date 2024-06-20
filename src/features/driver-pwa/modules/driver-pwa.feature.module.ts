import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DriverPwaFeatureRoutingModule } from './driver-pwa.feature-routing.module';
import { PAGES } from '../pages';
import { DateModule } from '../../common/date';
import { COMPONENTS } from '../components';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  declarations: [...PAGES, ...COMPONENTS],
  imports: [CommonModule, DriverPwaFeatureRoutingModule, DateModule]
})
export class DriverPwaFeatureModule {}
