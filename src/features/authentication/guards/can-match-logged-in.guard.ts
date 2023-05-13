import { Inject, Injectable } from '@angular/core';
import { Session, SESSION_PERSISTENCE } from '../providers';

@Injectable()
export class CanMatchLoggedInGuard {
  public constructor(@Inject(SESSION_PERSISTENCE) private readonly _session: Session) {}

  public canMatch = (): boolean => this._session.isLoggedIn;
}
