import { inferAsyncReturnType } from '@trpc/server';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/common/auth';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from '@/common/prisma';
import { env } from '@/common/environment';
import { Storage } from '@google-cloud/storage';

/**
 * Gets necessary context information for trpc procedures
 */
export async function createContext(options: CreateNextContextOptions) {
    const { req, res } = options;

    const session = await getServerSession(req, res, nextAuthOptions);

    const storage = new Storage({
        projectId: env.GCLOUD_PROJECT_ID,
        credentials: {
            client_email: env.GCLOUD_CLIENT_EMAIL,
            private_key: env.GCLOUD_PRIVATE_KEY.split(String.raw`\n`).join('\n'), // Needed to fix decoder runtime error
        },
    });

    const bucket = storage.bucket(env.STORAGE_BUCKET_NAME);

    return {
        req,
        res,
        session,
        prisma,
        bucket,
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;
