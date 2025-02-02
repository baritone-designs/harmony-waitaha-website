import { authRouter } from './auth';
import { chorusesRouter } from './choruses';
import { contentRouter } from './content';
import { eventsRouter } from './events';
import { peopleRouter } from './people';
import { quartetsRouter } from './quartets';
import { router } from './trpc';

export const appRouter = router({
    people: peopleRouter,
    events: eventsRouter,
    quartets: quartetsRouter,
    auth: authRouter,
    content: contentRouter,
    choruses: chorusesRouter,
});

export type AppRouter = typeof appRouter;
