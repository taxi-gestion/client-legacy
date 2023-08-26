import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DurationDistance } from '@domain';

export type EstimateJourneyValues = {
  driveDuration: number;
  driveDistance: number;
};

export type EstimateJourneyFields = {
  driveDuration: FormControl<EstimateJourneyValues['driveDuration']>;
  driveDistance: FormControl<EstimateJourneyValues['driveDistance']>;
};

export const ESTIMATE_JOURNEY_FORM_CONTROLS: Record<keyof EstimateJourneyValues, FormControl> = {
  driveDuration: new FormControl<EstimateJourneyValues['driveDuration']>(0, [Validators.required]),
  driveDistance: new FormControl<EstimateJourneyValues['driveDistance']>(0, [Validators.required])
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-estimate-journey-fields',
  templateUrl: './estimate-journey.fields.component.html'
})
export class EstimateJourneyFieldsComponent {
  @Input({ required: true }) public form!: FormGroup<EstimateJourneyFields>;

  @Input({ required: true }) public set estimateJourney(durationDistance: DurationDistance | null) {
    durationDistance != null && this.onJourneyEstimateReceived(durationDistance);
  }

  public onJourneyEstimateReceived(durationDistance: DurationDistance): void {
    this.form.controls.driveDuration.setValue(durationDistance.duration);
    this.form.controls.driveDistance.setValue(durationDistance.distance);
  }
}
