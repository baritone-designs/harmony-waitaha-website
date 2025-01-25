import { authRouter } from './auth';
import { eventsRouter } from './events';
import { peopleRouter } from './people';
import { quartetsRouter } from './quartets';
import { router } from './trpc';

export const appRouter = router({
    people: peopleRouter,
    events: eventsRouter,
    quartets: quartetsRouter,
    auth: authRouter,
});

export type AppRouter = typeof appRouter;
