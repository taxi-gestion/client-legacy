import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BillingListItem } from '../../../layouts/billing/billing.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-billing-column',
  templateUrl: './billing-list-column.component.html'
})
export class BillingListColumnComponent {
  @Input({ required: true }) public driver!: string;

  @Input({ required: true }) public fares!: BillingListItem[];
}
