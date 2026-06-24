import Image from 'next/image';
import Link from 'next/link';
import { MapComponent } from '@/components/map';

import React, { FC } from 'react';
import { IconType } from 'react-icons';

import './index.css';
import { prisma } from '@/common/prisma';
import { ChorusId, PageId } from '@prisma/client';
import { ScrollArrow } from '@/components/ScrollArrow';
import { MediaCarousel } from '@/components/Carousel';
import ScrollImage from '@/components/ScrollImage';
import MediaRenderer from '@/components/MediaRenderer';
import { FALLBACK_IMAGE, SOCIALS_ICONS, SOCIALS_PREFIX } from '@/common/constants';
import clsx from 'clsx';
import pageMetadata from '@/components/pageMetadata';
import QAHeader from './Header';
import People from './People';
import EventProfile from './EventProfile';

export const generateMetadata = () => pageMetadata(PageId.Qa);

interface SocialLinkProps {
    href: string;
    icon: IconType;
    className: string;
}

const SocialLink: FC<SocialLinkProps> = ({ href, icon: Icon, className }) => (
    <a href={href} target="_blank" rel="noreferrer" className="hover:text-qa-blue hover:drop-shadow-qa-glow-intense duration-200">
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
                <div className="from-qa-blue-darker relative z-10 flex h-screen flex-col justify-center bg-linear-to-t to-transparent to-30%">
                    <div className="flex w-screen justify-center">
                        <div className="w-full max-w-(--breakpoint-2xl) px-5 lg:px-20">
                            <div className="flex flex-col text-center text-5xl font-medium lg:text-left lg:text-8xl">
                                <span>
                                    <span className="text-qa-blue drop-shadow-qa-glow-light font-semibold">Q</span>
                                    <span>uantum</span>
                                </span>
                                <span>
                                    <span className="text-qa-blue drop-shadow-qa-glow-light font-semibold">A</span>
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
                <div className="w-full max-w-(--breakpoint-2xl) px-5 lg:px-20">
                    <section id="about" className="mb-10 space-y-4">
                        <span className="text-qa-blue text-4xl font-semibold">About Us</span>
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-20">
                            <p className="z-10">
                                {aboutParagraph}
                            </p>
                            <div>
                                <MediaCarousel className="z-10 aspect-video w-full rounded-3xl" mediaUrls={carouselMediaUrls} />
                            </div>
                        </div>
                        <div className="invisible flex w-full justify-center lg:visible">
                            <div className="bg-qa-white mb-1 h-0.5 w-60 rounded-full lg:mt-4" />
                        </div>
                        <div className="flex w-full justify-center">
                            <div className="grid grid-cols-2 items-center justify-between gap-3 lg:flex lg:flex-row lg:gap-14">
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
                        <span className="text-qa-blue text-4xl font-semibold">Upcoming Events</span>
                        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
                            {events.map(({ id, ...event }) => (
                                <EventProfile key={id} {...event} />
                            ))}
                            {events.length === 0 && (
                                <span>
                                    Quantum Acoustics have no scheduled events at this time, click
                                    {' '}
                                    <Link href="/#events" className="text-qa-blue hover:drop-shadow-qa-glow-intense duration-200">
                                        here
                                    </Link>
                                    {' '}
                                    to see events for all of Harmony Waitaha
                                </span>
                            )}
                        </div>
                    </section>
                    <section id="join" className="mb-20 space-y-4">
                        <span className="text-qa-blue text-4xl font-semibold">Wanna Join?</span>
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
                            <span className="text-qa-blue text-4xl font-semibold">Follow Us</span>
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
                        <a className="text-qa-blue hover:drop-shadow-qa-glow-intense hidden h-full flex-col items-center duration-200 lg:flex" href="/" target="_blank">
                            Harmony Waitaha Website ↗
                        </a>
                        <div className="flex flex-col items-end">
                            {logoUrl && <Image src={logoUrl} alt="qa-logo/" width={150} height={150} className="w-32" />}
                            <span>
                                © Quantum Acoustics
                                {new Date().getFullYear()}
                            </span>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
