import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { env } from '@/common/environment';

interface CustomNodeJsGlobal {
    prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient({ adapter: new PrismaPg(env.DATABASE_URL) });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export { prisma };
