import { inferAsyncReturnType } from '@trpc/server';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/common/auth';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

/**
 * Gets necessary context information for trpc procedures
 */
export async function createContext(options: CreateNextContextOptions) {
    const { req, res } = options;

    const session = await getServerSession(req, res, nextAuthOptions);

    return {
        req,
        res,
        session,
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;
