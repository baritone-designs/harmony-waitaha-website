import { eventsRouter } from './events';
import { peopleRouter } from './people';
import { router } from './trpc';

export const appRouter = router({
    people: peopleRouter,
    events: eventsRouter,
});

export type AppRouter = typeof appRouter;
