import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadActionDisplayComponent } from './load-action-display.component';
import { LoadActionDirective } from './load-action.directive';

@NgModule({
  declarations: [LoadActionDisplayComponent, LoadActionDirective],
  imports: [CommonModule],
  exports: [LoadActionDisplayComponent, LoadActionDirective]
})
export class LoadModule {}
