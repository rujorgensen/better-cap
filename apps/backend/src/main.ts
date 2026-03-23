import { getDomainAuthInstanceOrThrow } from './auth';
import { type Context, Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { version } from '../../../package.json';

if (Bun.env.NODE_ENV !== 'production' && Bun.env.NODE_ENV !== 'development') {
    throw new Error('NODE_ENV has to be either "production" or "development"');
}

// User middleware (compute user and session and pass to routes)
const betterAuth = new Elysia({
    name: 'better-auth-plugin',
})
    .all('/api/auth/*', async (context: Context) => {
        console.log(`\r\n\r\n🔒⭕\t(better-auth-plugin) [${context.request.method}] ${context.request.url}`);

        /*
            # Request headers
            console.log('Incomming headers:', context.request.headers.get('cookie'));

            eg, when signed in:
                cookie: better-auth.session_token=X6VCO0TpjtKhPfzhf5gUkFEN9C9v4ayF.soc3a9WnA8xoLT4UgXB3h6B%2FtC0VFAto33VreSjjMRk%3D

            eg, when not signed in:
                cookie: null
         */
        if (
            [
                'POST',
                'GET',
            ].includes(context.request.method)
        ) {
            const host: string | null = context.request.headers.get('x-forwarded-host') || context.request.headers.get('host');

            console.log(`🔒⭕\t(better-auth-plugin) Get BetterAuth instance for host '${host}', and handle request`);

            const response: Response = await getDomainAuthInstanceOrThrow(host)
                .handler(context.request);

            /*
                # Response.headers

                eg, when sign in:
                    "set-cookie": [ "better-auth.session_token=X6VCO0TptKhPfzhf5gUkFEN9C9v4ayF.soc3a9WnA8xoLT4UgXB3h6B%2FtC0VFAto33VreSjjMRk%3D;

                eg, when sign out:
                    "set-cookie": [ "better-auth.session_token=; ... 
             */

            if (response.ok || (response.status === 302)) {
                console.log(`🔓✅\t(better-auth-plugin) [${context.request.method}] response status: '${response.status}'`);
            } else {
                console.warn(response);
                console.error(`🔒⛔\t(better-auth-plugin) [${context.request.method}] response status: '${response.status}'`);
            }

            return response;
        }

        console.error(`🔒⛔\t(better-auth-plugin) [${context.request.method}] 405 ('method not allowed')`);
        context.status(405); // 'Method Not Allowed'

        return undefined;
    })

const app = new Elysia()

    .use(betterAuth)

    // CORS (always apply)
    .use(
        cors({}),
    )

    .get('/', () => {
        console.log(`👋\tReceived request for '/' route, responding with greeting message`)
        ;
        return 'You\'ve reached the Better Auth Elysia backend';
    })

    .listen(3100, ({ url }) => {
        console.log(`🚀🦊\tElysia server (${version}) running on ${url.href}, environment: '${Bun.env.NODE_ENV}'`);
    });
;

export type TApp = typeof app;
