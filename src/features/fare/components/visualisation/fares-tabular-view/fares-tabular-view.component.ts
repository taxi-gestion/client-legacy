import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MixedFaresPresentation } from '../../../pages/plan-with-context/plan-with-context.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-fares-tabular-view',
  templateUrl: './fares-tabular-view.component.html'
})
export class FaresTabularViewComponent {
  @Input({ required: true }) public entries!: MixedFaresPresentation[];
}
