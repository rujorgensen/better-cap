import { createAuthClient } from 'better-auth/client';
import { Capacitor } from '@capacitor/core';
import { capacitorClient } from 'better-auth-capacitor/client'

export type TUserSession = typeof authClient.$Infer.Session.user;

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using current domain) */
    baseURL: undefined,

    disableDefaultFetchPlugins: Capacitor.isNativePlatform(),

    // Apply plugins
    plugins: [
        capacitorClient({
            scheme: 'bettercapapp',
            storagePrefix: 'better-auth',
        }),
    ],
});
