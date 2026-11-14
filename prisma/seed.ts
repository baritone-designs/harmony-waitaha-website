import { PrismaPg } from '@prisma/adapter-pg';
import { ChorusId, PageId, PrismaClient } from '@prisma/client';
import { env } from '@/common/environment';

const prisma = new PrismaClient({ adapter: new PrismaPg(env.DATABASE_URL) });

async function seed() {
    await Promise.all(Object.values(PageId).map((id) => prisma.page.upsert({
        where: { id },
        create: {
            id,
            carouselMediaUrls: [],
        },
        update: {},
    })));

    await Promise.all(Object.values(ChorusId).map((id) => prisma.chorus.upsert({
        where: { id },
        create: {
            id,
            pageId: id,
            socials: {
                facebook: null,
                instagram: null,
                tiktok: null,
                youtube: null,
            },
        },
        update: {},
    })));
}

seed().then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
