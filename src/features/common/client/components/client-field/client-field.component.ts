import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, Observable, Subject, switchMap } from 'rxjs';
import { SEARCH_CLIENT_QUERY, SearchClientQuery } from '../../providers';
import { ClientPresentation } from '../../definitions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-client-field',
  templateUrl: './client-field.component.html'
})
export class ClientFieldComponent implements OnChanges {
  @Input() public minSearchTermLength: number = 2;
  @Input() public searchDebounceTime: number = 300;

  @Output() public readonly selectClient: EventEmitter<ClientPresentation> = new EventEmitter<ClientPresentation>();

  @Output() public readonly searchClientTerm: EventEmitter<string> = new EventEmitter<string>();

  @Output() public readonly resetClient: EventEmitter<void> = new EventEmitter<void>();

  @Input() public clientNotFound: boolean = false;

  @Input() public displayReset: boolean = false;

  @Input() public defaultValue?: string;

  private readonly _searchClientTerm$: Subject<string> = new Subject<string>();

  public clientsFound$: Observable<ClientPresentation[]> = this._searchClientTerm$.pipe(
    map((searchClientTerm: string): string => searchClientTerm.trim()),
    filter((searchClientTerm: string): boolean => searchClientTerm.length >= this.minSearchTermLength),
    debounceTime(this.searchDebounceTime),
    distinctUntilChanged(),
    switchMap((searchClientTerm: string): Observable<ClientPresentation[]> => this._searchClientQuery(searchClientTerm))
  );

  public constructor(@Inject(SEARCH_CLIENT_QUERY) private readonly _searchClientQuery: SearchClientQuery) {}

  public formGroup: FormGroup = new FormGroup({ client: new FormControl() });

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    simpleChanges['defaultValue'] != null && this.formGroup.get('client')?.setValue(this.defaultValue ?? '');
  }

  public search(clientInput: string): void {
    this._searchClientTerm$.next(clientInput);
    this.searchClientTerm.next(clientInput);
  }

  public setClientSuggestion(client: ClientPresentation): void {
    this.formGroup.get('client')?.setValue(`${client.lastname} ${client.firstname}`);
    this.selectClient.next(client);
  }

  public trackByClientName(_: number, client: ClientPresentation): string {
    return `${client.lastname}-${client.firstname}`;
  }

  public clear(): void {
    this.formGroup.get('client')?.reset();
    this.resetClient.emit();
  }
}
