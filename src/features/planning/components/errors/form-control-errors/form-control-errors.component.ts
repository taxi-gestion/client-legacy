import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControlStatus, FormGroupDirective } from '@angular/forms';
import { BehaviorSubject, filter, map, combineLatest, Observable, switchMap, tap } from 'rxjs';
import { FORM_CONTROL_ERROR_MESSAGES, FormControlErrorsNames } from './form-control-errors.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[formControlErrors]',
  templateUrl: './form-control-errors.component.html'
})
export class FormControlErrorsComponent implements OnInit {
  @Input({ required: true }) public formControlErrors!: FormControlErrorsNames;

  private readonly _control: BehaviorSubject<AbstractControl | null> = new BehaviorSubject<AbstractControl | null>(null);
  public errorMessage!: string;

  public displayError$: Observable<boolean> = this._control.asObservable().pipe(
    filter(Boolean),
    switchMap(
      (control: AbstractControl): Observable<boolean> =>
        combineLatest([control.valueChanges, control.statusChanges]).pipe(
          tap(([controlValue, _]: [unknown, FormControlStatus]): void => {
            this.errorMessage = FORM_CONTROL_ERROR_MESSAGES[this.formControlErrors](controlValue);
          }),
          map((): boolean => control.touched && control.invalid)
        )
    )
  );

  public constructor(private readonly formGroupDirective: FormGroupDirective) {}

  public ngOnInit(): void {
    const control: AbstractControl | null = this.formGroupDirective.form.get(this.formControlErrors);
    if (control === null) throw new Error(`Could not bind formControl error to ${this.formControlErrors}`);

    this._control.next(control);
  }
}
