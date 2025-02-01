import { ChorusId, PageId, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
