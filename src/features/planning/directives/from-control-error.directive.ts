import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractControl, FormControlStatus, FormGroupDirective } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appFormControlError]'
})
export class FormControlErrorDirective implements AfterViewInit, OnDestroy {
  @Input({ required: true }) public appFormControlError!: string;

  private _control: AbstractControl | null = null;
  private readonly _unsubscribe$: Subject<void> = new Subject<void>();

  public constructor(
    private readonly formGroupDirective: FormGroupDirective,
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef
  ) {}

  public ngAfterViewInit(): void {
    this._control = this.formGroupDirective.form.get(this.appFormControlError);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const element: HTMLInputElement | null = this.elementRef.nativeElement.querySelector(
      `input[formControlName="${this.appFormControlError}"]`
    );
    if (this._control === null || element === null) return;

    this._control.statusChanges.pipe(takeUntil(this._unsubscribe$)).subscribe((controlStatus: FormControlStatus): void => {
      controlStatus === 'VALID' ? this.renderer.addClass(element, 'is-valid') : this.renderer.removeClass(element, 'is-valid');
      controlStatus === 'INVALID'
        ? this.renderer.addClass(element, 'is-invalid')
        : this.renderer.removeClass(element, 'is-invalid');
    });
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
