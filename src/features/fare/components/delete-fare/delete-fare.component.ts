import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-fare.component.html',
  selector: 'app-delete-fare'
})
export class DeleteFareComponent<T> {
  @Input({ required: true }) public action$!: () => Observable<T>;

  @Output() public clicked: EventEmitter<void> = new EventEmitter<void>();

  @Output() public actionSuccess: EventEmitter<T> = new EventEmitter<T>();

  @Output() public actionError: EventEmitter<Error> = new EventEmitter<Error>();

  public onClick = (triggerAction: () => void): void => {
    triggerAction();
    this.clicked.emit();
  };

  public onActionSuccess = (fares: T): void => {
    this.actionSuccess.emit(fares);
  };

  public onActionError = (error: Error): void => {
    this.actionError.emit(error);
  };
}
