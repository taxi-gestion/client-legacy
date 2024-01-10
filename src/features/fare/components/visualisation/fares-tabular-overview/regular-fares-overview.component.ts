import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RecurringPresentation } from '../../../presentation';
import { MixedFaresPresentation } from '../../../pages/plan-with-context/plan-with-context.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-fares-tabular-overview',
  templateUrl: './regular-fares-overview.component.html'
})
export class RegularFaresOverviewComponent {
  @Input({ required: true }) public recurring!: RecurringPresentation[];
  @Input({ required: true }) public forthcoming!: MixedFaresPresentation[];
  @Input({ required: true }) public past!: MixedFaresPresentation[];
  @Input({ required: true }) public regularId!: string;
}
