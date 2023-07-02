import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { PlanningSettingsValues } from '../../planning-settings/planning-settings.form';
import { moreThanValidator } from './more-than.validator';

describe('more than validator', (): void => {
  it('should get invalidHourError when end hour is before start hour', (): void => {
    const form: FormGroup = new FormGroup({
      startHour: new FormControl<PlanningSettingsValues['startHour']>('08'),
      endHour: new FormControl<PlanningSettingsValues['endHour']>('12')
    });

    const errors: ValidationErrors | null = moreThanValidator('endHour')(form.get('startHour') as FormControl<string>);

    expect(errors).toStrictEqual({ invalidHourError: true });
  });

  it('should get invalidHourError when end hour is equal to start hour', (): void => {
    const form: FormGroup = new FormGroup({
      startHour: new FormControl<PlanningSettingsValues['startHour']>('12'),
      endHour: new FormControl<PlanningSettingsValues['endHour']>('12')
    });

    const errors: ValidationErrors | null = moreThanValidator('endHour')(form.get('startHour') as FormControl<string>);

    expect(errors).toStrictEqual({ invalidHourError: true });
  });

  it('should not get invalidHourError when end hour is after start hour', (): void => {
    const form: FormGroup = new FormGroup({
      startHour: new FormControl<PlanningSettingsValues['startHour']>('12'),
      endHour: new FormControl<PlanningSettingsValues['endHour']>('08')
    });

    const errors: ValidationErrors | null = moreThanValidator('endHour')(form.get('startHour') as FormControl<string>);

    expect(errors).toBeNull();
  });
});
