import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const DEFAULT_INDEX: number = -1;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'autocompleteResultsDropdown',
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[appAutocompleteResultsDropdown]',
  templateUrl: './autocomplete-results-dropdown.component.html'
})
export class AutocompleteResultsDropdownComponent {
  private _expanded: boolean = false;

  private readonly _expanded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._expanded);

  public activeIndex: number = DEFAULT_INDEX;

  public expanded$: Observable<boolean> = this._expanded$.asObservable();

  @ContentChildren('results') public results: QueryList<ElementRef> | null = null;

  @Input() public dropdownControl: HTMLElement | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() public addEntryTemplate: TemplateRef<any> | null = null;
  @Input() public hasResults: boolean = false;

  @Output() public readonly indexChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() public set expanded(expanded: boolean) {
    this._expanded$.next(expanded);
    this._expanded = expanded;
  }

  @Output() public clear: EventEmitter<void> = new EventEmitter<void>();

  public expand(): void {
    this._expanded$.next(true);
    this._expanded = true;
  }

  public reduce(): void {
    this.dropdownControl?.focus();
    this._expanded$.next(false);
    this._expanded = false;
  }

  public clearSearch(): void {
    this.reduce();
    this.clear.emit();
  }

  public setIndex(index: number): void {
    this.activeIndex = index;
    this.indexChange.next(this.activeIndex);
  }

  public focus(): void {
    if (this.results?.first == null) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.results.first.nativeElement.firstChild.focus();
  }
}
