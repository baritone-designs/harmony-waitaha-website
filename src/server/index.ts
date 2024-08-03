import { peopleRouter } from './people';
import { router } from './trpc';

export const appRouter = router({
    people: peopleRouter,
});

export type AppRouter = typeof appRouter;
