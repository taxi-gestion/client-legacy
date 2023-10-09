import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DateComponent } from '../components/date.component';
import { DateService } from '../services';

@NgModule({
  exports: [DateComponent],
  declarations: [DateComponent],
  imports: [CommonModule],
  providers: [DateService]
})
export class DateModule {}
