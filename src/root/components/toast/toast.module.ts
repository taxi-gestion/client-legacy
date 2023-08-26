import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastComponent } from './toast.component';

@NgModule({
  exports: [ToastComponent],
  declarations: [ToastComponent],
  imports: [CommonModule]
})
export class ToastModule {}
