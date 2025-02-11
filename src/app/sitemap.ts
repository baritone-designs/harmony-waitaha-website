import { prisma } from '@/common/prisma';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const quartets = await prisma.quartet.findMany({
        select: {
            id: true,
        },
    });
    const quartetsSitemap = quartets.map((quartet) => ({
        url: `https://www.harmonywaitaha.co.nz/?quartet=${quartet.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
    }));

    return [
        {
            url: 'https://www.harmonywaitaha.co.nz/',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://www.harmonywaitaha.co.nz/qa',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://www.harmonywaitaha.co.nz/plainsmen',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...quartetsSitemap,
    ];
}
