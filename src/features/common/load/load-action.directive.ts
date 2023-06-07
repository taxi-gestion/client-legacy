import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { catchError, map, mergeWith, Observable, Subject, switchMap, tap } from 'rxjs';
import { START_LOADING, STOP_LOADING, whileLoading } from '@features/common';

@Directive({
  selector: '[appLoadAction]',
  exportAs: 'loadAction'
})
export class LoadActionDirective<T> {
  @Input({ required: true, alias: 'appLoadAction' }) public action$!: () => Observable<T>;

  @Output() public actionSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public actionError: EventEmitter<Error> = new EventEmitter<Error>();

  private readonly _isLoading$: Subject<boolean> = new Subject<boolean>();

  private readonly _triggerWhileLoading$: Observable<boolean> = this._isLoading$.pipe(
    switchMap(whileLoading((): Observable<T> => this.action$())),
    catchError((error: Error, caught: Observable<T>): Observable<T> => {
      this.actionError.emit(error);
      this._isLoading$.next(STOP_LOADING);
      return caught;
    }),
    tap((): void => this.actionSuccess.emit()),
    map((): boolean => STOP_LOADING)
  );

  public readonly isLoading$: Observable<boolean> = this._isLoading$.pipe(mergeWith(this._triggerWhileLoading$));

  public start = (): void => this._isLoading$.next(START_LOADING);
}
