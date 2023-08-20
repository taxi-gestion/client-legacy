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
import { SEARCH_USER_QUERY, SearchUserQuery } from '../../providers';
import { User } from '@features/common/user';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-field',
  templateUrl: './user-field.component.html'
})
export class UserFieldComponent implements OnChanges {
  @Input() public minSearchTermLength: number = 0;
  @Input() public searchDebounceTime: number = 300;

  @Output() public readonly selectUser: EventEmitter<User> = new EventEmitter<User>();

  @Output() public readonly resetUser: EventEmitter<void> = new EventEmitter<void>();

  @Input() public userNotFound: boolean = false;

  @Input() public displayReset: boolean = false;

  @Input() public defaultValue?: string;

  private readonly _searchUserTerm$: Subject<string> = new Subject<string>();

  public usersFound$: Observable<User[]> = this._searchUserTerm$.pipe(
    map((searchUserTerm: string): string => searchUserTerm.trim()),
    filter((searchUserTerm: string): boolean => searchUserTerm.length >= this.minSearchTermLength),
    debounceTime(this.searchDebounceTime),
    distinctUntilChanged(),
    switchMap((searchUserTerm: string): Observable<User[]> => this._searchUserQuery(searchUserTerm))
  );

  public constructor(@Inject(SEARCH_USER_QUERY) private readonly _searchUserQuery: SearchUserQuery) {}

  public formGroup: FormGroup = new FormGroup({ user: new FormControl() });

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    simpleChanges['defaultValue'] != null && this.formGroup.get('user')?.setValue(this.defaultValue ?? '');
  }

  public search(userInput: string): void {
    this._searchUserTerm$.next(userInput);
  }

  public setUserSuggestion(user: User): void {
    this.formGroup.get('user')?.setValue(user.identifier);
    this.selectUser.next(user);
  }

  public trackByUserId(_: number, user: User): string {
    return user.id;
  }

  public clear(): void {
    this.formGroup.get('user')?.reset();
    this.resetUser.emit();
  }
}
