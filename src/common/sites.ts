import { ChorusId, PageId } from '@prisma/client';

/**
 * Display info for each chorus.
 *
 * To add new chorus:
 * 1. Add to prisma schema (and create migration)
 * 2. Add entry below
 * 3. Create page
 */
export const CHORUS_INFO: Record<ChorusId, { name: string, pageId: PageId }> = {
    Plainsmen: { name: 'Plainsmen', pageId: PageId.Plainsmen },
    Qa: { name: 'Quantum Acoustics', pageId: PageId.Qa },
};

export interface Site {
    /** Used in URLs, both for the public page and the admin page (/edit/<slug>) */
    slug: string;
    name: string;
    pageId: PageId;
    /** The chorus this site belongs to, or null for the Harmony Waitaha homepage */
    chorusId: ChorusId | null;
    /** Path of the public page */
    publicPath: string;
}

export const SITES: Site[] = [
    {
        slug: 'harmony-waitaha',
        name: 'Harmony Waitaha',
        pageId: PageId.Home,
        chorusId: null,
        publicPath: '/',
    },
    ...Object.values(ChorusId).map((chorusId) => ({
        slug: chorusId.toLowerCase(),
        name: CHORUS_INFO[chorusId].name,
        pageId: CHORUS_INFO[chorusId].pageId,
        chorusId,
        publicPath: `/${chorusId.toLowerCase()}`,
    })),
];
