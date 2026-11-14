'use client';

import { Site } from '@/common/sites';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import { CardGridSkeleton, PageFormSkeleton } from '../_components/Skeletons';
import EventsEditor from './EventsEditor';
import PageEditor from './PageEditor';
import PeopleEditor from './PeopleEditor';
import QuartetsEditor from './QuartetsEditor';

interface EditorTab {
    id: string;
    label: string;
    content: ReactNode;
    fallback: ReactNode;
}

/**
 * The tabs available for a site. Chorus sites get people, the Harmony Waitaha homepage gets quartets
 */
function getTabs(site: Site): EditorTab[] {
    return [
        { id: 'page', label: 'Page content', content: <PageEditor site={site} />, fallback: <PageFormSkeleton /> },
        site.chorusId
            ? { id: 'people', label: 'People', content: <PeopleEditor chorusId={site.chorusId} />, fallback: <CardGridSkeleton /> }
            : { id: 'quartets', label: 'Quartets', content: <QuartetsEditor />, fallback: <CardGridSkeleton /> },
        { id: 'events', label: 'Events', content: <EventsEditor chorusId={site.chorusId} />, fallback: <CardGridSkeleton /> },
    ];
}

export default function SiteEditor({ site }: { site: Site }) {
    const tabs = getTabs(site);

    const searchParams = useSearchParams();
    const activeTab = tabs.find(({ id }) => id === searchParams?.get('tab')) ?? tabs[0];

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Container maxWidth="xl">
                    <Tabs
                        value={activeTab.id}
                        // Next keeps useSearchParams in sync with history.replaceState, so this avoids a server round trip
                        onChange={(_, tab: string) => window.history.replaceState(null, '', `?tab=${tab}`)}
                        variant="scrollable"
                    >
                        {tabs.map(({ id, label }) => <Tab key={id} value={id} label={label} />)}
                    </Tabs>
                </Container>
            </Box>
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Suspense key={`${site.slug}-${activeTab.id}`} fallback={activeTab.fallback}>
                    {activeTab.content}
                </Suspense>
            </Container>
        </>
    );
}
