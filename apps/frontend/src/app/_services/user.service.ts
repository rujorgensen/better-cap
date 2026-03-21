import { shareReplay, type Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { OnlineUserSessionService } from './user-session.service';
import type { TUserSession } from '../_auth/auth-client';

@Injectable({
    providedIn: 'root',
})
export class UserService {

    public readonly user$$: Observable<TUserSession | null>;

    constructor(
        private readonly _onlineUserSessionService: OnlineUserSessionService,
    ) {
        this.user$$ = this._onlineUserSessionService.session$$
            .pipe(
                shareReplay(1),
            );
    }

    public signOut(

    ): void {
        this._onlineUserSessionService.signOut();
    }
}
