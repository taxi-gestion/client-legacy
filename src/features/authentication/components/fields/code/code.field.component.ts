import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-code-field',
  templateUrl: './code.field.component.html'
})
export class CodeFieldComponent {
  @Input() public codeControl?: FormControl<string>;

  @Input() public errors?: ValidationErrors | null;

  @Input() set touched(isTouched: boolean) {
    isTouched && this.codeControl?.markAsTouched();
  }
}
