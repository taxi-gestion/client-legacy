import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-submit',
  templateUrl: './submit.component.html'
})
export class SubmitComponent {
  @Input() public isLoading: boolean = false;
}
