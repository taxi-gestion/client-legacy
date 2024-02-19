/* eslint-disable */
import { Directive, EventEmitter, Output, ElementRef } from '@angular/core';
import { fromEvent, merge, Observable, Subject, switchMap, takeUntil, tap, timestamp, map, filter } from 'rxjs';

@Directive({
  selector: '[appHoldTrigger]',
  exportAs: 'holdTrigger'
})
export class HoldTriggerDirective {
  @Output() public trigger: EventEmitter<void> = new EventEmitter<void>();

  // Define a subject that acts as a notifier for unsubscription/cleanup
  private _unsubscribe$: Subject<void> = new Subject<void>();

  public readonly triggerOnHold$: Observable<void>;

  constructor(private host: ElementRef) {
    this.triggerOnHold$ = merge(
      fromEvent<MouseEvent>(this.host.nativeElement, 'mousedown'),
      fromEvent<TouchEvent>(this.host.nativeElement, 'touchstart')
    ).pipe(
      timestamp(),
      switchMap((startEvent) =>
        merge(fromEvent<MouseEvent>(document, 'mouseup'), fromEvent<TouchEvent>(document, 'touchend')).pipe(
          timestamp(),
          filter((endEvent) => endEvent.timestamp - startEvent.timestamp >= 1000),
          takeUntil(this._unsubscribe$), // Use unsubscribe$ to manage unsubscription
          tap(() => this.trigger.emit()),
          map(() => {}) // Ensure the observable chain maps to void
        )
      )
    );

    // Automatically subscribe to the observable to activate it
    this.triggerOnHold$.subscribe();
  }

  public ngOnDestroy(): void {
    // Notify to unsubscribe when directive is destroyed
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
