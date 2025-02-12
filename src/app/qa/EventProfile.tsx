'use client';

import { googleMapsLocationUrl } from '@/components/utils';
import { Event } from '@prisma/client';
import { MdLocationPin } from 'react-icons/md';
import { google } from 'calendar-link';

export default function EventProfile({ name, venueId, venueName, time, description }: Pick<Event, 'name' | 'venueId' | 'venueName' | 'time' | 'description'>) {
    return (
        <div className="rounded-3xl border-4 border-qa-blue p-5">
            <div className="mb-3 flex flex-row justify-between">
                <div>
                    <span className="text-2xl">{name}</span>
                    <a
                        className="flex flex-row items-center gap-2 [&>*]:duration-300 [&>*]:hover:text-qa-blue [&>*]:hover:drop-shadow-qa-glow-intense"
                        href={googleMapsLocationUrl(venueName, venueId)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <MdLocationPin />
                        <span className="font-pt-sans">{venueName}</span>
                    </a>
                </div>
                <a
                    className="flex flex-col items-end [&>*]:duration-300 [&>*]:hover:text-qa-blue [&>*]:hover:drop-shadow-qa-glow-intense"
                    href={google({
                        title: name,
                        description,
                        location: venueName,
                        start: time,
                        duration: [2, 'hour'],
                    })}
                    target="_blank"
                    rel="noreferrer"
                >
                    <span className="font-pt-sans">{time.toLocaleDateString()}</span>
                    <span className="font-pt-sans">{time.toLocaleTimeString(undefined, { timeStyle: 'short' }).toUpperCase()}</span>
                </a>
            </div>
            <p className="">{description}</p>
            <a href="/" className="text-qa-blue duration-300 hover:drop-shadow-qa-glow-intense">Learn more</a>
        </div>
    );
}
