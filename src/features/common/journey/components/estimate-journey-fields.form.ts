import { FormControl, Validators } from '@angular/forms';
import { DurationDistance } from '@definitions';

export type EstimateJourneyFields<T extends string, U extends string> = {
  [K in T | U]: FormControl<number>;
};

export const estimateJourneyFieldsFormControl = <T extends string, U extends string>(
  durationControlName: T,
  distanceControlName: U,
  value?: DurationDistance | undefined
): EstimateJourneyFields<T, U> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ({
    [durationControlName]: new FormControl<number>(value === undefined ? 0 : value.duration, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    [distanceControlName]: new FormControl<number>(value === undefined ? 0 : value.distance, {
      nonNullable: true,
      validators: [Validators.required]
    })
  } as EstimateJourneyFields<T, U>);
