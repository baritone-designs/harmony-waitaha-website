'use client';

import { googleMapsLocationUrl } from '@/components/utils';
import Link from 'next/link';
import { Event } from '@prisma/client';
import { MdLocationPin } from 'react-icons/md';
import { google } from 'calendar-link';

export default function EventProfile({ name, venueId, venueName, time, description }: Pick<Event, 'name' | 'venueId' | 'venueName' | 'time' | 'description'>) {
    return (
        <div className="border-qa-blue rounded-3xl border-4 p-5">
            <div className="mb-3 flex flex-row justify-between">
                <div>
                    <span className="text-2xl">{name}</span>
                    <a
                        className="[&>*]:hover:text-qa-blue [&>*]:hover:drop-shadow-qa-glow-intense flex flex-row items-center gap-2 *:duration-300"
                        href={googleMapsLocationUrl(venueName, venueId)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <MdLocationPin />
                        <span className="font-pt-sans">{venueName}</span>
                    </a>
                </div>
                <a
                    className="[&>*]:hover:text-qa-blue [&>*]:hover:drop-shadow-qa-glow-intense flex flex-col items-end *:duration-300"
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
                    <span className="font-pt-sans">{time.toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    <span className="font-pt-sans">{time.toLocaleTimeString(undefined, { timeStyle: 'short' }).toUpperCase()}</span>
                </a>
            </div>
            <p className="">{description}</p>
            <Link href="/" className="text-qa-blue hover:drop-shadow-qa-glow-intense duration-300">Learn more</Link>
        </div>
    );
}
