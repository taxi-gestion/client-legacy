import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHorizontalMouseScroll]'
})
export class HorizontalMouseScrollDirective {
  public constructor(private readonly element: ElementRef) {}

  @HostListener('wheel', ['$event'])
  public onWheelEvent(wheelEvent: WheelEvent): void {
    if (wheelEvent.deltaY !== 0) {
      wheelEvent.preventDefault();
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      this.element.nativeElement.scrollLeft += wheelEvent.deltaY;
    }
  }
}
