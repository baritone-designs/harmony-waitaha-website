import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/edit/', '/auth/'],
        },
        sitemap: 'https://www.harmonywaitaha.co.nz/sitemap.xml',
    };
}
