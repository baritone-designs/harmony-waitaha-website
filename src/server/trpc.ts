import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Context } from '@/server/context';

export const t = initTRPC.context<Context>().create({
    // Handles Date/Map/Set
    transformer: superjson,
});

export const { router } = t;
export const publicProcedure = t.procedure;
