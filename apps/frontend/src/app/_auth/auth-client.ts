import { createAuthClient } from 'better-auth/client';
import { Capacitor } from '@capacitor/core';
import { capacitorClient } from 'better-auth-capacitor/client'

export type TUserSession = typeof authClient.$Infer.Session.user;

export const betterAuthBaseURL = Capacitor.isNativePlatform() ?
    'http://<INSERT_YOUR_IP>:3100'
    :
    'http://localhost:3100'
    ;

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using current domain) */
    baseURL: betterAuthBaseURL,

    disableDefaultFetchPlugins: Capacitor.isNativePlatform(),

    // Apply plugins
    plugins: [
        capacitorClient({
            scheme: 'bettercapapp',
            storagePrefix: 'better-auth',
        }),
    ],
});
