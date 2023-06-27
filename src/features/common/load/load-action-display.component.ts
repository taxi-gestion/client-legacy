import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[appLoadActionDisplay]',
  templateUrl: './load-action-display.component.html'
})
export class LoadActionDisplayComponent {
  @Input('appLoadActionDisplay') public isLoading: boolean | null = false;
}
