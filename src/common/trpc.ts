import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { AppRouter } from '@/server';
import superjson from 'superjson';

/**
 * Handler for react query hooks
 */
const reactHandler = createTRPCNext<AppRouter>({
    transformer: superjson,
    config() {
        return {
            links: [
                httpBatchLink({
                    url: '/api/trpc',
                    transformer: superjson,
                }),
            ],
        };
    },
});

/**
 * Handler for traditional function query calls
 */
const clientHandler = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: '/api/trpc',
            transformer: superjson,
        }),
    ],
});

export const trpc = {
    react: reactHandler,
    client: clientHandler,
};
