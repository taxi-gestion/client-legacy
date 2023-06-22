import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { catchError, map, Observable, share, Subject, switchMap, tap } from 'rxjs';
import { START_LOADING, STOP_LOADING, whileLoading } from '@features/common';

@Directive({
  selector: '[appLoadAction]',
  exportAs: 'loadAction'
})
export class LoadActionDirective<T> {
  @Input({ required: true, alias: 'appLoadAction' }) public action$!: () => Observable<T>;

  @Output() public actionSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public actionError: EventEmitter<Error> = new EventEmitter<Error>();

  private readonly _triggerWhileLoading$ = (trigger$: Observable<boolean>): Observable<boolean> =>
    trigger$.pipe(
      switchMap(whileLoading((): Observable<T> => this.action$())),
      catchError((error: Error, caught: Observable<T>): Observable<T> => {
        this.actionError.emit(error);
        return caught;
      }),
      tap((): void => this.actionSuccess.emit()),
      map((): boolean => STOP_LOADING),
      share()
    );

  private readonly _trigger$: Subject<boolean> = new Subject<boolean>();
  public readonly isLoading$: Observable<boolean> = this._triggerWhileLoading$(this._trigger$);

  public start = (): void => this._trigger$.next(START_LOADING);
}
