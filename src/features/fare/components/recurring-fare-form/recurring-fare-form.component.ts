import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { fareEmptyValue, isMedicalDrive, isTwoWayDrive, AddRecurringFields, RecurringToAddValues } from '../../presentation';
import { BehaviorSubject, Observable } from 'rxjs';
import { bootstrapValidationClasses, BootstrapValidationClasses } from '@features/common/form-validation';
import { DriverValues } from '@features/common/driver';
import { RegularValues } from '@features/regular';
import { WaypointValues } from '@features/common/waypoint';
import { AddRecurring } from '../../../../definitions';
import { toValidLocalDatetimeInputValue } from '../../../common/presentation';
import { setErrorsToForm, toFormErrors } from '../../pages/common.form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recurring-fare-form.component.html',
  selector: 'app-recurring-fare-form'
})
export class RecurringFareFormComponent {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Input({ required: true }) public recurringFareForm!: FormGroup<AddRecurringFields>;
  @Input({ required: true }) public action$!: () => Observable<AddRecurring>;
  @Input({ required: true }) public drivers!: DriverValues[];
  @Input({ required: true }) public initialValues: Partial<RecurringToAddValues> = fareEmptyValue;
  @Input({ required: true }) public regular!: RegularValues;
  @Input({ required: true }) public displayReturnTime!: boolean;

  @Output() public submitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public actionSuccess: EventEmitter<AddRecurring> = new EventEmitter<AddRecurring>();

  @Output() public actionError: EventEmitter<Error> = new EventEmitter<Error>();

  private readonly _occurrences$: BehaviorSubject<Date[]> = new BehaviorSubject<Date[]>([]);
  public occurrences$: Observable<Date[]> = this._occurrences$.asObservable();

  public onSubmit = (triggerAction: () => void): void => {
    this.recurringFareForm.markAllAsTouched();

    // TODO Testing to validate only through codecs
    triggerAction();
    this.submitted.emit();
  };

  public onActionSuccess = (fares: AddRecurring): void => {
    this.recurringFareForm.reset();
    this.actionSuccess.emit(fares);
  };

  public onActionError = (error: Error): void => {
    setErrorsToForm(this.recurringFareForm)(toFormErrors(error));
    this.actionError.emit(error);
  };

  public onArrivalSelected(arrival: WaypointValues): void {
    if (arrival.setKind !== 'none') {
      this.recurringFareForm.controls.isTwoWayDrive.setValue(isTwoWayDrive(arrival.setKind));
    }
    if (arrival.setNature !== 'none') {
      this.recurringFareForm.controls.isMedicalDrive.setValue(isMedicalDrive(arrival.setNature));
    }
  }

  public nowDateString: string = toValidLocalDatetimeInputValue(new Date());

  public onRecurrenceRuleChange(recurrence: { rule: string; occurrences: Date[] }): void {
    this.recurringFareForm.controls.recurrenceRule.setValue(recurrence.rule);
    this._occurrences$.next(recurrence.occurrences);
  }
}
