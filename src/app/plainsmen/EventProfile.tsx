'use client';

import { googleMapsLocationUrl } from '@/components/utils';
import { Event } from '@prisma/client';
import { MdLocationPin } from 'react-icons/md';
import { google } from 'calendar-link';

export default function EventProfile({ name, venueName, venueId, time, description }: Pick<Event, 'name' | 'venueName' | 'venueId' | 'time' | 'description'>) {
    return (
        <div className="rounded-xl bg-zinc-800 px-8 py-6">
            <div className="mb-3 flex flex-row justify-between">
                <div>
                    <span className="text-2xl text-hw-white">{name}</span>
                    <a
                        className="flex flex-row items-center gap-2 [&>*]:duration-200 [&>*]:hover:opacity-50"
                        href={googleMapsLocationUrl(venueName, venueId)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <MdLocationPin />
                        <span className="text-hw-white">{venueName}</span>
                    </a>
                </div>

                <a
                    className="flex flex-col items-end [&>*]:text-hw-white [&>*]:duration-200 [&>*]:hover:opacity-50"
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
                    <span>{time.toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    <span>{time.toLocaleTimeString(undefined, { timeStyle: 'short' }).toUpperCase()}</span>
                </a>
            </div>
            <p className="font-light text-hw-white">{description}</p>
            <a href="/" className="text-pm-blue underline duration-200 hover:opacity-50">Learn more</a>
        </div>
    );
}
