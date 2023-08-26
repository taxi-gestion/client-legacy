import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToasterPresenter } from './toaster.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toaster',
  templateUrl: './toaster.component.html'
})
export class ToasterComponent {
  public constructor(public readonly toaster: ToasterPresenter) {}
}
