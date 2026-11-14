import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
        seed: 'tsx prisma/seed.ts',
    },
    datasource: {
        // Prisma v7 CLI uses the main 'url' property for running migrations, so use the
        // unpooled connection here (pooled connections don't support advisory locks)
        url: env('DATABASE_URL_UNPOOLED'),
        shadowDatabaseUrl: env('SHADOW_DATABASE_URL_UNPOOLED'),
    },
});
