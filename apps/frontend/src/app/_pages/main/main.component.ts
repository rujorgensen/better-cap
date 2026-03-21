import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { authClient } from '../../_auth/auth-client';
import { AsyncPipe } from '@angular/common';
import { UserService } from '../../_services/user.service';
import { version } from '../../../../../../package.json';

@Component({
    templateUrl: './main.component.html',
    imports: [
        FormsModule,
        AsyncPipe,
    ],
    styleUrls: [
        './main.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {

    protected readonly signingIn: WritableSignal<boolean> = signal(false);
    protected readonly version: string = version;

    constructor(
        protected readonly _userService: UserService,
    ) { }

    /**
     * Sign in using Google.
     */
    protected signInGoogle(

    ): void {
        // Disable button and show loading state
        this.signingIn.set(true);

        // Google Sign-In
        authClient.signIn.social(
            {
                provider: 'google',
                // The URL to redirect to after sign-in
                callbackURL: '/',
            },
            {
                onSuccess: async () => {
                    console.log('Google sign-in successful, will redirect ... probably');
                },

                onError: (ctx: any) => {
                    const errorMessage = ctx.error.message || ctx.response.statusText;
                    // Display the error message
                    console.error(`[authClient.signIn.social] Got the following error: '${errorMessage}'`);
                    toast.error(`[authClient.signIn.social] Got the following error: '${errorMessage}'`);

                    // Re-enable button
                    this.signingIn.set(false);
                },
            },
        );
    }

}
