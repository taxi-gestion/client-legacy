import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-password-field',
  templateUrl: './password.field.component.html'
})
export class PasswordFieldComponent {
  @Input() public passwordControl!: FormControl<string>;

  @Input() public errors?: ValidationErrors | null;

  @Input() public displayAllErrors: boolean = false;

  @Input() set touched(isTouched: boolean) {
    isTouched && this.passwordControl?.markAsTouched();
  }
}
