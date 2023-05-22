import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

const ANIMATION_DURATION: 300 = 300 as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  private readonly _showing$: Subject<boolean> = new Subject<boolean>();
  public readonly showing$: Observable<boolean> = this._showing$.asObservable();

  private readonly _hiding$: Subject<boolean> = new Subject<boolean>();
  public readonly hiding$: Observable<boolean> = this._hiding$.asObservable();

  private readonly _expanded$: Subject<boolean> = new Subject<boolean>();
  public readonly expanded$: Observable<boolean> = this._expanded$.asObservable();

  private _isExpanded: boolean = false;

  public toggle(): void {
    this._isExpanded ? this._hiding$.next(true) : this._showing$.next(true);
    this._isExpanded = !this._isExpanded;
    this._expanded$.next(this._isExpanded);

    setTimeout((): void => {
      this._showing$.next(false);
      this._hiding$.next(false);
    }, ANIMATION_DURATION);
  }
}
