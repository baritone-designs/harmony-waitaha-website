import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: "tsx prisma/seed.ts",
    },
    datasource: {
        // Prisma v7 CLI uses the main 'url' property for running migrations
        // Pass your unpooled connection string here to replace 'directUrl'
        url: env("DATABASE_URL"), // uses connection pooling
        directUrl: env("DATABASE_URL_UNPOOLED"), // used for migrations
        shadowDatabaseUrl: env("SHADOW_DATABASE_URL_UNPOOLED"),
    },
});
