import { Component, Input } from '@angular/core';

type User = {
  username: string;
  groups: string[];
};

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html'
})
export class UserCardComponent {
  @Input({ required: true }) public user!: User;
}
