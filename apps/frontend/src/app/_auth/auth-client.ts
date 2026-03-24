import { createAuthClient } from 'better-auth/client';
import { Capacitor } from '@capacitor/core';
import { capacitorClient } from 'better-auth-capacitor/client'

export type TUserSession = typeof authClient.$Infer.Session.user;

export const MACHINE_URL = undefined; // eg. 'http://192.168.1.200:3100';

export const betterAuthBaseURL = Capacitor.isNativePlatform() ?
    MACHINE_URL
    :
    'http://localhost:3100'
    ;

export const authClient = createAuthClient({
    /** 
     * The base URL of the server (optional if you're using current domain) 
     * 
     * Add the port if missing.
     */
    baseURL: betterAuthBaseURL?.includes(':3100') ?
        betterAuthBaseURL
        :
        `${betterAuthBaseURL}:3100`
    ,

    disableDefaultFetchPlugins: Capacitor.isNativePlatform(),

    // Apply plugins
    plugins: [
        capacitorClient({
            scheme: 'bettercapapp',
            storagePrefix: 'better-auth',
        }),
    ],
});
