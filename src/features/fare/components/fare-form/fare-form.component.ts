import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { fareEmptyValue, FareFields, FareValues } from '../../presentation';
import { Observable } from 'rxjs';
import {
  bootstrapValidationClasses,
  BootstrapValidationClasses,
  forceControlRevalidation
} from '@features/common/form-validation';
import { formatFareError, setFareErrorToForm } from '../../pages/fare.form';
import { DriverValues } from '@features/common/driver';
import { RegularValues } from '@features/common/regular';
import { formatDateToDatetimeLocalString } from '../../../planning/common/unit-convertion';
import { metersToKilometers, secondsToMinutes, toValidLocalDatetimeInputValue } from '@features/common/presentation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fare-form.component.html',
  selector: 'app-fare-form'
})
export class FareFormComponent<T> implements OnInit {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Input({ required: true }) public fareForm!: FormGroup<FareFields>;
  @Input({ required: true }) public action$!: () => Observable<T>;
  @Input({ required: true }) public drivers!: DriverValues[];
  @Input({ required: true }) public initialValues: Partial<FareValues> = fareEmptyValue;
  @Input({ required: true }) public regular!: RegularValues;
  @Input() public mode: 'create' | 'edit' = 'create';

  @Input() public set selectedDate(date: Date | null) {
    if (date === null) return;

    this.fareForm.controls.departureDatetime.setValue(formatDateToDatetimeLocalString(date));
  }

  @Output() public submitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public actionSuccess: EventEmitter<T> = new EventEmitter<T>();

  @Output() public actionError: EventEmitter<Error> = new EventEmitter<Error>();

  public onSubmit = (triggerAction: () => void): void => {
    this.fareForm.markAllAsTouched();
    this.fareForm.valid ? triggerAction() : forceControlRevalidation(this.fareForm);
    this.submitted.emit();
  };

  public onActionSuccess = (fares: T): void => {
    this.fareForm.reset();
    this.actionSuccess.emit(fares);
  };

  public onActionError = (error: Error): void => {
    setFareErrorToForm(formatFareError(error));
    this.actionError.emit(error);
  };

  // TODO Should have a component for departure datetime and checkboxes so as to have the same behavior as other inputs
  // eslint-disable-next-line max-statements
  public ngOnInit(): void {
    if (this.initialValues.departureDatetime !== undefined) {
      this.fareForm.controls.departureDatetime.setValue(
        toValidLocalDatetimeInputValue(new Date(this.initialValues.departureDatetime))
      );
    }

    if (this.initialValues.isTwoWayDrive !== undefined) {
      this.fareForm.controls.isTwoWayDrive.setValue(this.initialValues.isTwoWayDrive);
    }

    if (this.initialValues.isMedicalDrive !== undefined) {
      this.fareForm.controls.isMedicalDrive.setValue(this.initialValues.isMedicalDrive);
    }

    if (this.initialValues.driveDuration !== undefined) {
      this.fareForm.controls.driveDuration.setValue(secondsToMinutes(this.initialValues.driveDuration));
    }

    if (this.initialValues.driveDistance !== undefined) {
      this.fareForm.controls.driveDistance.setValue(metersToKilometers(this.initialValues.driveDistance));
    }
  }
}
