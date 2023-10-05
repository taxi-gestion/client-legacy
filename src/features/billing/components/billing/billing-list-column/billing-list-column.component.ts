import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BillingItem } from '../../../definitions/billing.presentation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-billing-column',
  templateUrl: './billing-list-column.component.html'
})
export class BillingListColumnComponent {
  @Input({ required: true }) public driver!: string;

  @Input({ required: true }) public fares!: BillingItem[];
}
