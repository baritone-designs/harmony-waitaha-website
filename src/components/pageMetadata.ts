import { prisma } from '@/common/prisma';
import { PageId } from '@prisma/client';
import { Metadata } from 'next';

export default async function pageMetadata(pageId: PageId): Promise<Metadata> {
    const { iconUrl, title, description } = await prisma.page.findFirstOrThrow({
        where: {
            id: pageId,
        },
        select: {
            iconUrl: true,
            description: true,
            title: true,
        },
    });

    return {
        title,
        description,
        icons: iconUrl && [iconUrl],
    };
}
