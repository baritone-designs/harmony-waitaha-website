'use client';

import { ReactNode } from 'react';
import PastEventsSection from './PastEventsSection';

interface EventLike {
    id: string;
    time: Date;
}

interface EventsSectionProps<T extends EventLike> {
    events: T[];
    renderEvent: (event: T) => ReactNode;
    emptyMessage?: ReactNode;
    titleClassName?: string;
    className?: string;
}

export default function EventsSection<T extends EventLike>({
    events,
    renderEvent,
    emptyMessage,
    titleClassName,
    className,
}: EventsSectionProps<T>) {
    const now = new Date();
    const upcomingEvents = events
        .filter((e) => new Date(e.time) >= now)
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    const pastEvents = events
        .filter((e) => new Date(e.time) < now)
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return (
        <div className={className}>
            <section id="events" className="space-y-4">
                <span className={titleClassName}>Upcoming Events</span>
                <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
                    {upcomingEvents.map((event) => (
                        <div key={event.id} className="contents">
                            {renderEvent(event)}
                        </div>
                    ))}
                    {upcomingEvents.length === 0 && emptyMessage}
                </div>
            </section>

            {pastEvents.length > 0 && (
                <PastEventsSection titleClassName={titleClassName}>
                    {pastEvents.map((event) => (
                        <div key={event.id} className="contents">
                            {renderEvent(event)}
                        </div>
                    ))}
                </PastEventsSection>
            )}
        </div>
    );
}
