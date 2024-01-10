import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { fareEmptyValue, FareFields, FareValues, isMedicalDrive, isTwoWayDrive } from '../../presentation';
import { Observable } from 'rxjs';
import {
  bootstrapValidationClasses,
  BootstrapValidationClasses,
  forceControlRevalidation
} from '@features/common/form-validation';
import { formatFareError, setFareErrorToForm } from '../../pages/fare.form';
import { DriverValues } from '@features/common/driver';
import { RegularValues } from '@features/regular';
import { metersToKilometers, secondsToMinutes, toValidLocalDatetimeInputValue } from '@features/common/presentation';
import { WaypointValues } from '@features/common/waypoint';

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
  @Input({ required: true }) public mode!: 'edit-scheduled' | 'pending' | 'scheduled' | 'unassigned';

  @Input() public set selectedDate(date: Date | null) {
    if (date === null) return;

    this.fareForm.controls.departureDatetime.setValue(toValidLocalDatetimeInputValue(date));
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
    setFareErrorToForm(this.fareForm)(formatFareError(error));
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

    if (this.initialValues.driveDuration !== undefined) {
      this.fareForm.controls.driveDuration.setValue(secondsToMinutes(this.initialValues.driveDuration));
    }

    if (this.initialValues.driveDistance !== undefined) {
      this.fareForm.controls.driveDistance.setValue(metersToKilometers(this.initialValues.driveDistance));
    }
  }

  public onArrivalSelected(arrival: WaypointValues): void {
    if (this.mode === 'pending') return;

    if (arrival.setKind !== 'none') {
      this.fareForm.controls.isTwoWayDrive.setValue(isTwoWayDrive(arrival.setKind));
    }
    if (arrival.setNature !== 'none') {
      this.fareForm.controls.isMedicalDrive.setValue(isMedicalDrive(arrival.setNature));
    }
  }
}
