import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ToastModule } from '../toast';
import { ToasterComponent } from './toaster.component';
import { ToasterPresenter } from './toaster.presenter';

@NgModule({
  exports: [ToasterComponent],
  declarations: [ToasterComponent],
  imports: [CommonModule, ToastModule]
})
export class ToasterModule {
  public static forRoot(): ModuleWithProviders<ToasterModule> {
    return {
      ngModule: ToasterModule,
      providers: [ToasterPresenter]
    };
  }
}
