import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Session, SESSION_PERSISTENCE } from '../../../authentication';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html'
})
export class HomePage {
  public userGroups: string[];
  public constructor(@Inject(SESSION_PERSISTENCE) private readonly _session: Session) {
    this.userGroups = this._session.groups();
  }

  public isManagerAndDriver(): boolean {
    return (this.userGroups.includes('manager') && this.userGroups.includes('driver')) || this.userGroups.includes('developer');
  }

  public isManagerOnly(): boolean {
    return this.userGroups.includes('manager') && !this.userGroups.includes('driver');
  }
}
