import { prisma } from '@/common/prisma';
import { SITES } from '@/common/sites';
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
        ...SITES.map((site) => ({
            url: `https://www.harmonywaitaha.co.nz${site.publicPath}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        })),
        ...quartetsSitemap,
    ];
}
