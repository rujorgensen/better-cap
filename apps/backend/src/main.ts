import { getDomainAuthInstanceOrThrow } from './auth';
import { type Context, Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { version } from '../../../package.json';

if (Bun.env.NODE_ENV !== 'production' && Bun.env.NODE_ENV !== 'development') {
    throw new Error('NODE_ENV has to be either "production" or "development"');
}

// User middleware (compute user and session and pass to routes)
const betterAuth = new Elysia({
    name: 'better-auth',
})
    .all('/api/auth/*', (context: Context) => {
        console.log(`hit: ${context.request.url}`);

        if (
            [
                'POST',
                'GET',
            ].includes(context.request.method)
        ) {
            const host: string | null = context.request.headers.get('x-forwarded-host') || context.request.headers.get('host');

            return getDomainAuthInstanceOrThrow(host)
                .handler(context.request);
        }

        context.status(405); // 'Method Not Allowed'

        return undefined;
    })

const app = new Elysia()

    .use(betterAuth)

    // CORS
    .use(
        cors(
            Bun.env.NODE_ENV === 'production'
                ? undefined
                // Allow all origins and methods in development for testing
                : {},
        ),
    )

  //  .get('/', () => 'You\'ve reached the Better Auth Elysia backend')

    //.get('/', () => 'Handled by server on 3100')
    .all('/*', async ({ request, set, path }) => {
        console.log(`Proxying request to upstream: ${request.method} ${path}`);

        const upstreamUrl = `http://localhost:3101${path}`;
        const upstreamResponse = await fetch(upstreamUrl, {
            method: request.method,
            headers: request.headers,
            body: request.body,
        });

        // Forward the upstream response
        set.status = upstreamResponse.status;
        return new Response(upstreamResponse.body, {
            status: upstreamResponse.status,
            headers: upstreamResponse.headers,
        });
    })

    .listen(3100, ({ url }) => {
        console.log(`🚀🦊 Elysia server (${version}) running on ${url.href}, NODE_ENV: '${Bun.env.NODE_ENV}'`);
    });
;

export type TApp = typeof app;
