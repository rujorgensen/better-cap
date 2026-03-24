import { ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { authClient, betterAuthBaseURL, MACHINE_URL } from '../../_auth/auth-client';
import { AsyncPipe } from '@angular/common';
import { UserService } from '../../_services/user.service';
import { version } from '../../../../../../package.json';
import { Capacitor } from '@capacitor/core';

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
export class MainComponent implements OnInit {

    protected readonly signingIn: WritableSignal<boolean> = signal(false);
    protected readonly version: string = version;
    protected readonly betterAuthBaseURL: string;
    protected readonly origin: string = window.location.origin;

    private loadingToast: string | number | undefined;

    constructor(
        protected readonly _userService: UserService,
    ) {
        if (!betterAuthBaseURL) {
            this.betterAuthBaseURL = `<LOCAL IP MUST BE SET IN "auth-client.ts">`;
        } else {
            this.betterAuthBaseURL = betterAuthBaseURL;
        }
    }

    public ngOnInit(

    ): void {
        if (!MACHINE_URL && Capacitor.isNativePlatform()) {
            toast.error('Set the URL of the host machine for the native platform in "auth-client.ts"');
        }
    }

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
                    callbackURL: this.origin,
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
