import { Directive } from '@angular/core';

@Directive({
  selector: '[appPasswordDisplay]',
  exportAs: 'passwordDisplay'
})
export class PasswordDisplayDirective {
  public isDisplayed: boolean = false;

  public toggleDisplay = (): boolean => {
    this.isDisplayed = !this.isDisplayed;
    return this.isDisplayed;
  };
}
