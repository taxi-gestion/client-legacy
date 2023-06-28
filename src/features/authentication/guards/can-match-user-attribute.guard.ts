import { Inject, Injectable } from '@angular/core';
import { Serializable, SESSION_PERSISTENCE, TokenSession } from '../providers';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class CanMatchUserAttributeGuard {
  public constructor(@Inject(SESSION_PERSISTENCE) private readonly _session: TokenSession) {}

  public canMatch = (route: ActivatedRouteSnapshot): boolean =>
    userHasAttribute(this._session.idTokenPayload(route.data['userAttribute'] as string));
}

const userHasAttribute = (attribute: Serializable): boolean => attribute != null && attribute !== '';
