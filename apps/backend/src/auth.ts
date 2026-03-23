import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma-types/bettercap';
import { PrismaPg } from '@prisma/adapter-pg';
import { capacitor } from 'better-auth-capacitor'


if (!process.env['GOOGLE_CLIENT_ID']) {
    throw new Error('GOOGLE_CLIENT_ID is not set in .env');
}
const googleClientId: string = process.env['GOOGLE_CLIENT_ID'];

if (!process.env['GOOGLE_CLIENT_SECRET']) {
    throw new Error('GOOGLE_CLIENT_SECRET is not set in .env');
}
const googleClientSecret: string = process.env['GOOGLE_CLIENT_SECRET'];

if (!process.env['BETTERCAP_DATABASE_URL']) {
    throw new Error('BETTERCAP_DATABASE_URL is not set in .env');
}

const BETTERCAP_DATABASE_URL: string = process.env['BETTERCAP_DATABASE_URL'];

export const prismaClient = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: BETTERCAP_DATABASE_URL,
    }),
});

/**
 * ! If changing this configuration, make sure to run `bun auth:generate` to apply the changes.
 */
const createAuthForDomain = (
    baseURL?: string,
) => betterAuth({
    /**
     * baseURL: 'https://example.com',
     * This cannot be set (or BETTER_AUTH_URL), as we need to support multiple origins (localhost, mydomain.app, mydomain.de)
     *
     * UPDATE 1:
     * BetterAuth infers http:// ..., so auto inferrence cannot be used
     *
     * UPDATE 2:
     * advanced.trustedProxyHeaders cannot be used either, as the BetterAuth instance uses the first request to
     * determine host (so if you first get a request on `domain.com`, `domain.net` would never work)
     *
     * advanced: {
     *   trustedProxyHeaders: true
     * },
     *
     * UPDATE 3:
     * Going with https://github.com/better-auth/better-auth/issues/4151#issuecomment-3375609750
     *
     */
    baseURL: baseURL ? `https://${baseURL}` : undefined,
    database: prismaAdapter(prismaClient, {
        provider: 'postgresql',
    }),
    trustedOrigins: [
        'http://localhost:3101',
        // The URL scheme used by Capacitor apps
        'capacitor://localhost',
        // Deep link used by the Android app
        'bettercapapp://'
    ],
    socialProviders: {
        google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
        },
    },
    plugins: [
        capacitor({
            disableOriginOverride: false,
        }),
    ],
});

// Better Auth requires baseURL to be configured. If it is not set, the origin
// of the first request will be used, both for that request and for all
// subsequent requests. To support multiple origins, we create a Better Auth
// instance per origin. In the future, Better Auth may support dynamic baseURL.
// Ref: https://github.com/better-auth/better-auth/issues/4151
const authInstances = new Map<string, ReturnType<typeof createAuthForDomain>>();

export const getDomainAuthInstanceOrThrow = (
    host: string | null | undefined,
) => {

    if (!host) {
        throw new Error('Host is not set');
    }

    if (!authInstances.has(host)) {
        console.log(`🔨\tCreating new BetterAuth instance for host: '${host}'`);

        const baseURL_ = host?.includes('localhost') ? undefined : host;

        authInstances.set(host, createAuthForDomain(baseURL_));
    }

    return authInstances.get(host)!;
}