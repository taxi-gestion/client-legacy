import { Component, Input } from '@angular/core';
import { Serializable } from '@features/authentication';

type User = {
  username: Serializable;
  groups: Serializable;
};

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html'
})
export class UserCardComponent {
  @Input() public user?: User | null;
}
