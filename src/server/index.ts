import { publicProcedure, router } from './trpc';

export const appRouter = router({
    hello: publicProcedure.query(async () => 'Welcome'),
});

export type AppRouter = typeof appRouter;
