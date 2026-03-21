import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, tap, type Observable } from 'rxjs';
import { authClient, TUserSession } from '../_auth/auth-client';

const UN_INITIALIZED = undefined;
const NOT_LOGGED_IN = null;
type TUninitialized = typeof UN_INITIALIZED;
type TNotLoggedIn = typeof NOT_LOGGED_IN;

@Injectable({
    providedIn: 'root',
})
export class OnlineUserSessionService {
    public readonly session$$: Observable<TUserSession | null>;
    private readonly session$$_: BehaviorSubject<TUserSession | TNotLoggedIn | TUninitialized> = new BehaviorSubject<TUserSession | TNotLoggedIn | TUninitialized>(UN_INITIALIZED);

    constructor(
    ) {
        this.session$$ = this.session$$_
            .asObservable()
            .pipe(
                tap(async (userSession: TUserSession | TNotLoggedIn | TUninitialized) => {
                    if (userSession === UN_INITIALIZED) {
                        try {
                            const session = await authClient.getSession();

                            this.session$$_.next(session.data?.user ?? NOT_LOGGED_IN);
                        } catch (error) {
                            console.error(`Error fetching session: '${error instanceof Error ? error.message : String(error)}'`);

                            this.session$$_.error(error);
                        }
                    }
                }),
                filter((session: TUserSession | TNotLoggedIn | TUninitialized) => session !== UN_INITIALIZED),
            );
    }

    public signOut(

    ): Promise<void> {
        this.session$$_.next(NOT_LOGGED_IN);

        return authClient.signOut().then(() => void 0);
    }
}
