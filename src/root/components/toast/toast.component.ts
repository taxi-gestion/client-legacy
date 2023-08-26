import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastStatus = 'danger' | 'default' | 'info' | 'success' | 'warning';

const ANIMATION_DURATION: 100 = 100 as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toast',
  templateUrl: './toast.component.html'
})
export class ToastComponent implements OnInit {
  private _isShown: boolean = true;
  private readonly _isShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._isShown);
  public readonly isShown$: Observable<boolean> = this._isShown$.asObservable();

  private readonly _isShowing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isShowing$: Observable<boolean> = this._isShowing$.asObservable();

  @Output() public hidden: EventEmitter<void> = new EventEmitter<void>();

  @Input() public title?: string;

  @Input() public canHide: boolean = true;

  @Input() public status: ToastStatus = 'default';

  @Input() public delay: number = 3000;

  @Input() public autohide: boolean = true;

  public ngOnInit(): void {
    this.autohide && setTimeout((): void => this.hide(), this.delay);
  }

  private onCloseAnimationEnd(): void {
    this._isShown = false;
    this._isShowing$.next(false);
    this._isShown$.next(false);
    this.hidden.emit();
  }

  public hide(): void {
    this._isShowing$.next(true);
    setTimeout((): void => this.onCloseAnimationEnd(), ANIMATION_DURATION);
  }
}
