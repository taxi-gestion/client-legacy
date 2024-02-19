import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadActionDisplayComponent } from './load-action-display.component';
import { LoadActionDirective } from './load-action.directive';
import { HoldTriggerDirective } from './hold-trigger.directive';

@NgModule({
  declarations: [LoadActionDisplayComponent, LoadActionDirective, HoldTriggerDirective],
  imports: [CommonModule],
  exports: [LoadActionDisplayComponent, LoadActionDirective, HoldTriggerDirective]
})
export class LoadUiModule {}
