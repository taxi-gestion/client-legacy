import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const DEFAULT_INDEX: number = -1;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'dropdownPane',
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[appDropdownPane]',
  templateUrl: './dropdown-pane.component.html'
})
export class DropdownPaneComponent {
  private _expanded: boolean = false;

  private readonly _expanded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._expanded);

  public activeIndex: number = DEFAULT_INDEX;

  public expanded$: Observable<boolean> = this._expanded$.asObservable();

  @Input() public dropdownControl: HTMLElement | null = null;

  @Output() public readonly indexChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() public set expanded(expanded: boolean) {
    this._expanded$.next(expanded);
    this._expanded = expanded;
  }

  private clickOnMenuControl(clickEvent: Event): boolean {
    return this.dropdownControl?.contains(clickEvent.target as HTMLElement) ?? false;
  }

  public expand(): void {
    this._expanded$.next(true);
    this._expanded = true;
  }

  public reduce(): void {
    this.dropdownControl?.focus();
    this._expanded$.next(false);
    this._expanded = false;
  }

  public toggle(): void {
    this._expanded ? this.reduce() : this.expand();
  }

  public setIndex(index: number): void {
    this.activeIndex = index;
    this.indexChange.next(this.activeIndex);
  }

  @HostListener('document:click', ['$event']) public onClickOutside(clickEvent: Event): void {
    if (!this._expanded || this.clickOnMenuControl(clickEvent)) return;
    this._expanded$.next(false);
    this._expanded = false;
  }

  @HostListener('document:keydown.escape') public onEscape(): void {
    this.reduce();
  }
}
