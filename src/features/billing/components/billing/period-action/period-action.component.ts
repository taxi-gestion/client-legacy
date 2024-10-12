import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-period-action',
  template: `
    <div class="d-flex flex-column align-items-start">
      <div class="form-group pe-3 ps-3 mb-3">
        <label for="from-date" class="form-label">Date début</label>
        <input
          #fromInput
          id="from-date"
          name="from"
          type="date"
          class="form-control form-control-lg w-auto"
          (input)="checkDates(fromInput.valueAsDate, toInput.valueAsDate)" />
      </div>

      <div class="form-group pe-3 ps-3 mb-3">
        <label for="to-date" class="form-label">Date fin</label>
        <input
          #toInput
          id="to-date"
          name="to"
          type="date"
          class="form-control form-control-lg w-auto"
          (input)="checkDates(fromInput.valueAsDate, toInput.valueAsDate)" />
      </div>

      <button
        class="btn btn-primary m-3"
        [ngClass]="{ disabled: !isDateRangeValid }"
        [disabled]="!isDateRangeValid"
        (click)="executeAction(fromInput.valueAsDate!, toInput.valueAsDate!)">
        Exporter période sur Excel - Par passager
      </button>
    </div>
  `,
  styles: [
    `
      .form-group {
        width: 100%;
      }
      .d-flex {
        width: 100%;
        max-width: 400px;
      }
    `
  ]
})
export class PeriodActionComponent {
  @Input({ required: true }) public action!: (from: Date, to: Date) => void;
  public isDateRangeValid: boolean = false;

  // Method to validate that both dates are selected
  public checkDates(from: Date | null, to: Date | null): void {
    this.isDateRangeValid = !(from == null) && !(to == null); // Check that both dates are not null
  }

  public executeAction(from: Date, to: Date): void {
    if (this.isDateRangeValid) {
      this.action(from, to);
    }
  }
}
