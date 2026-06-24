'use client';

import { googleMapsLocationUrl } from '@/components/utils';
import { Event } from '@prisma/client';
import { MdLocationPin } from 'react-icons/md';
import { google } from 'calendar-link';

export default function EventProfile({ name, venueName, venueId, time, description, learnMoreUrl }: Pick<Event, 'name' | 'venueName' | 'venueId' | 'time' | 'description' | 'learnMoreUrl'>) {
    return (
        <div className="bg-hw-black rounded-3xl px-8 py-6">
            <div className="mb-3 flex flex-row justify-between">
                <div>
                    <span className="text-hw-white text-2xl">{name}</span>
                    <a
                        className="flex flex-row items-center gap-2 *:duration-200 *:hover:opacity-50"
                        href={googleMapsLocationUrl(venueName, venueId)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <MdLocationPin />
                        <span className="text-hw-white">{venueName}</span>
                    </a>
                </div>

                <a
                    className="[&>*]:text-hw-white flex flex-col items-end *:duration-200 *:hover:opacity-50"
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
            <p className="text-hw-white font-light">{description}</p>
            {learnMoreUrl && <a href={learnMoreUrl} target="_blank" className="text-hw-blue underline duration-200 hover:opacity-50" rel="noreferrer">Learn more</a>}
        </div>
    );
}
