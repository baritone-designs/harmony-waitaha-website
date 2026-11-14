import { SITES } from '@/common/sites';
import { notFound } from 'next/navigation';
import SiteEditor from './SiteEditor';

export default async function EditSitePage({ params }: { params: Promise<{ site: string }> }) {
    const { site: slug } = await params;

    const site = SITES.find((s) => s.slug === slug);

    if (!site) {
        notFound();
    }

    return <SiteEditor site={site} />;
}
