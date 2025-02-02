import Image from 'next/image';
import { MapComponent } from '@/components/map';

import React, { FC } from 'react';
import { IconType } from 'react-icons';
import { Metadata } from 'next';

import './index.css';
import { MdLocationPin } from 'react-icons/md';
import { google } from 'calendar-link';
import { prisma } from '@/common/prisma';
import { ChorusId, Event } from '@prisma/client';
import { ScrollArrow } from '@/components/ScrollArrow';
import { googleMapsLocationUrl } from '@/components/utils';
import { MediaCarousel } from '@/components/Carousel';
import ScrollImage from '@/components/ScrollImage';
import MediaRenderer from '@/components/MediaRenderer';
import { FALLBACK_IMAGE, SOCIALS_ICONS, SOCIALS_PREFIX } from '@/common/constants';
import clsx from 'clsx';
import QAHeader from './Header';
import People from './People';

export const metadata: Metadata = {
    title: 'Quantum Acoustics',
    description: 'Youth barbershop mixed chorus from Christchurch, New Zealand',
};

const EventProfile = ({ name, venueId, venueName, time, description }: Pick<Event, 'name' | 'venueId' | 'venueName' | 'time' | 'description'>) => (
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

interface SocialLinkProps {
    href: string;
    icon: IconType;
    className: string;
}

const SocialLink: FC<SocialLinkProps> = ({ href, icon: Icon, className }) => (
    <a href={href} target="_blank" rel="noreferrer" className="duration-200 hover:text-qa-blue hover:drop-shadow-qa-glow-intense">
        <Icon size={45} className={className} />
    </a>
);

export default async function QAHome() {
    const { socials, page: { iconUrl, logoUrl, aboutParagraph, carouselMediaUrls, headerMediaUrl, recruitmentParagraph } } = await prisma.chorus.findFirstOrThrow({
        where: {
            id: ChorusId.Qa,
        },
        select: {
            socials: true,
            page: {
                select: {
                    logoUrl: true,
                    iconUrl: true,
                    aboutParagraph: true,
                    headerMediaUrl: true,
                    carouselMediaUrls: true,
                    recruitmentParagraph: true,
                },
            },
        },
    });

    const people = (await prisma.personChorus.findMany({
        where: {
            chorusId: ChorusId.Qa,
        },
        include: {
            person: true,
        },
    })).map((x) => ({
        role: x.role,
        ...x.person,
    }));

    const events = (await prisma.event.findMany({
        where: {
            choruses: {
                some: {
                    id: ChorusId.Qa,
                },
            },
        },
    }));

    return (
        <main className="[&>*]:font-pt-sans">
            <QAHeader iconUrl={iconUrl} />
            <section id="home" className="h-screen">
                <div className="relative z-10 flex h-screen flex-col justify-center bg-gradient-to-t from-qa-blue-darker to-transparent to-30%">
                    <div className="flex w-screen justify-center">
                        <div className="w-full max-w-screen-2xl px-5 lg:px-20">
                            <div className="flex flex-col text-center text-5xl font-medium lg:text-left lg:text-8xl">
                                <span>
                                    <span className="font-semibold text-qa-blue drop-shadow-qa-glow-light">Q</span>
                                    <span>uantum</span>
                                </span>
                                <span>
                                    <span className="font-semibold text-qa-blue drop-shadow-qa-glow-light">A</span>
                                    <span>coustics</span>
                                </span>
                                <div className="flex justify-center lg:justify-start">
                                    <div className="mt-2 flex gap-4 text-white lg:mt-6 lg:gap-8">
                                        {Object.entries(socials)
                                            .map(([key, value]) => value && (
                                                <SocialLink
                                                    key={key}
                                                    icon={SOCIALS_ICONS[key as keyof typeof SOCIALS_ICONS]}
                                                    href={SOCIALS_PREFIX[key as keyof typeof SOCIALS_PREFIX] + value}
                                                    className="w-6 lg:w-10"
                                                />
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pointer-events-none absolute inset-0">
                    <MediaRenderer
                        className="size-full"
                        url={headerMediaUrl ?? FALLBACK_IMAGE}
                        imageOveride={(
                            <ScrollImage
                                url={headerMediaUrl ?? FALLBACK_IMAGE}
                                className="-left-1/3 opacity-40 lg:left-[30%] lg:opacity-100 lg:shadow-[inset_400px_200px_200px_#101c2a]"
                            />
                        )}
                    />
                </div>
                <ScrollArrow />
            </section>
            <div className="flex justify-center">
                <div className="w-full max-w-screen-2xl px-5 lg:px-20">
                    <section id="about" className="mb-10 space-y-4">
                        <span className="text-4xl font-semibold text-qa-blue">About Us</span>
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-20">
                            <p className="z-10">
                                {aboutParagraph}
                            </p>
                            <div className="">
                                <MediaCarousel className="z-10 aspect-auto w-full rounded-3xl" mediaUrls={carouselMediaUrls} />
                            </div>
                        </div>
                        <div className="invisible flex w-full justify-center lg:visible">
                            <div className="mb-1 h-0.5 w-60 rounded-full bg-qa-white lg:mt-4" />
                        </div>
                        <div className="flex w-full justify-center">
                            <div className="z-0 grid grid-cols-2 items-center justify-between gap-3 lg:flex lg:flex-row lg:gap-14">
                                <People people={people} />
                                {people.length === 0 && (
                                    <span>
                                        We have team members we would like to show here, but they are a bit shy, why don't you come along to one of our rehearsals to meet them for real!
                                    </span>
                                )}
                            </div>
                        </div>
                    </section>
                    <section id="events" className="mb-10 space-y-4">
                        <span className="text-4xl font-semibold text-qa-blue">Upcoming Events</span>
                        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
                            {events.map(({ id, ...event }) => (
                                <EventProfile key={id} {...event} />
                            ))}
                            {events.length === 0 && (
                                <span>
                                    Quantum Acoustics have no scheduled events at this time, click
                                    {' '}
                                    <a href="/#events" className="text-qa-blue duration-200 hover:drop-shadow-qa-glow-intense">
                                        here
                                    </a>
                                    {' '}
                                    to see events for all of Harmony Waitaha
                                </span>
                            )}
                        </div>
                    </section>
                    <section id="join" className="mb-20 space-y-4">
                        <span className="text-4xl font-semibold text-qa-blue">Wanna Join?</span>
                        <div className="w-full gap-5 lg:flex lg:flex-row">
                            <div className="lg:w-2/3">
                                <p>
                                    {recruitmentParagraph}
                                </p>
                            </div>
                            <MapComponent />
                        </div>
                    </section>
                    <section id="footer" className="mb-5 flex flex-row items-end justify-between lg:mb-10">
                        <div className={clsx(Object.values(socials).filter((x) => !!x).length === 0 && 'invisible')}>
                            <span className="text-4xl font-semibold text-qa-blue">Follow Us</span>
                            <div className="mt-0 flex gap-4 text-white lg:mt-1">
                                {Object.entries(socials)
                                    .map(([key, value]) => value && (
                                        <SocialLink
                                            key={key}
                                            icon={SOCIALS_ICONS[key as keyof typeof SOCIALS_ICONS]}
                                            href={SOCIALS_PREFIX[key as keyof typeof SOCIALS_PREFIX] + value}
                                            className="w-5 lg:w-7"
                                        />
                                    ))}
                            </div>
                        </div>
                        <a className="hidden h-full flex-col items-center text-qa-blue duration-200 hover:drop-shadow-qa-glow-intense lg:flex" href="/" target="_blank">
                            Harmony Waitaha Website ↗
                        </a>
                        <div className="flex flex-col items-end">
                            {logoUrl && <Image src={logoUrl} alt="qa-logo/" width={150} height={150} className="w-32" />}
                            <span>© Quantum Acoustics {new Date().getFullYear()}</span>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
