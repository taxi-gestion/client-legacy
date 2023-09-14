import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControlStatus, FormGroup, FormGroupDirective } from '@angular/forms';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '../../../providers/error-messages.token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[formControlErrors]',
  templateUrl: './form-control-errors.component.html'
})
export class FormControlErrorsComponent implements OnInit {
  @Input({ required: true }) public formControlErrors!: string;
  @Input({ required: false }) public formArrayErrors: FormArray | undefined;
  @Input({ required: false }) public formArrayErrorsIndex: number | undefined;

  private readonly _control: BehaviorSubject<AbstractControl | null> = new BehaviorSubject<AbstractControl | null>(null);
  public errorMessage!: string;
  private _$errorMessageHandler!: (controlValue: unknown) => string;

  public displayError$: Observable<boolean> = this._control.asObservable().pipe(
    filter(Boolean),
    switchMap(
      (control: AbstractControl): Observable<boolean> =>
        combineLatest([control.valueChanges, control.statusChanges]).pipe(
          tap(([controlValue, _]: [unknown, FormControlStatus]): void => {
            this.errorMessage = this._$errorMessageHandler(controlValue);
          }),
          map((): boolean => control.touched && control.invalid)
        )
    )
  );

  public constructor(
    private readonly formGroupDirective: FormGroupDirective,
    @Inject(FORM_CONTROL_ERROR_MESSAGES_TOKEN)
    private readonly _formControlErrorMessages: Record<string, (controlValue: unknown) => string>
  ) {}

  public ngOnInit(): void {
    this._$errorMessageHandler = this.getMessageHandler();
    this._control.next(this.getControl());
  }

  private getMessageHandler(): (controlValue: unknown) => string {
    const handler: ((controlValue: unknown) => string) | undefined = this._formControlErrorMessages[this.formControlErrors];

    if (handler === undefined) throw new Error(`No error message match ${this.formControlErrors} key, verify injected token`);

    return handler;
  }

  private getControl(): AbstractControl {
    const control: AbstractControl | null =
      this.formArrayErrors === undefined || this.formArrayErrorsIndex === undefined
        ? this.formGroupDirective.form.get(this.formControlErrors)
        : (this.formArrayErrors.at(this.formArrayErrorsIndex) as FormGroup).get(this.formControlErrors);

    if (control === null) throw new Error(`Could not bind formControl error to ${this.formControlErrors}`);
    return control;
  }
}
