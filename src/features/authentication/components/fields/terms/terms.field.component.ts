import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-terms-field',
  templateUrl: './terms.field.component.html'
})
export class TermsFieldComponent {
  @Input() public termsControl!: FormControl<boolean>;

  @Input() set touched(isTouched: boolean) {
    isTouched && this.termsControl.markAsTouched();
  }
}
