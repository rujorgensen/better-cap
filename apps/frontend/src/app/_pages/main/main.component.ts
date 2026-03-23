import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { authClient, betterAuthBaseURL } from '../../_auth/auth-client';
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
    protected readonly betterAuthBaseURL: string = betterAuthBaseURL;
    protected readonly callbackURL: string = window.location.host.includes('http') ?
        `http://${window.location.origin}`
        :
        window.location.origin
        ;

    private loadingToast: string | number | undefined;

    constructor(
        protected readonly _userService: UserService,
    ) { }

    /**
     * Sign in using Google.
     */
    protected signInGoogle(

    ): void {

        // Google Sign-In
        authClient
            .signIn
            .social(
                {
                    provider: 'google',
                    // The URL to redirect to after sign-in
                    callbackURL: this.callbackURL,
                },
                {
                    onRequest: () => {
                        this.loadingToast = toast.loading(`Signing in, please hold`, { duration: 60_000, position: 'top-center' });
                        // Disable button and show loading state
                        this.signingIn.set(true);
                    },
                    onSuccess: () => {
                        toast.dismiss(this.loadingToast);
                        this.loadingToast = undefined;
                        console.log('Google sign-in successful, will redirect ... probably');
                        toast.success(`Sign-in successful, will redirect ... probably`);
                    },

                    onError: (context) => this.handleError(context, undefined),
                },
            )
            .catch((error) => this.handleError(undefined, error))
            ;
    }

    private handleError(
        context?: any,
        error?: any,
    ): void {
        // Re-enable button
        this.signingIn.set(false);

        // Dismiss the loading toast
        toast.dismiss(this.loadingToast);
        this.loadingToast = undefined;

        // Extract and display the error message
        const errorMessage = context?.error?.message ||
            context?.response?.statusText ||
            error?.message ||
            'Unknown error';

        toast.error(`Sign in failed: '${errorMessage}'`);
    }
}
