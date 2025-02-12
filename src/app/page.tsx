import Image from 'next/image';
import { FC } from 'react';
import { MdEmail, MdLocationPin, MdPhone } from 'react-icons/md';
import { google } from 'calendar-link';
import { prisma } from '@/common/prisma';
import { Event, PageId } from '@prisma/client';
import { ScrollArrow } from '@/components/ScrollArrow';
import VideoAudio from '@/components/VideoAudio';

import './index.css';
import { googleMapsLocationUrl } from '@/components/utils';
import { FALLBACK_IMAGE, TIMEZONE } from '@/common/constants';
import pageMetadata from '@/components/pageMetadata';
import MediaRenderer from '@/components/MediaRenderer';
import HWHeader from './Header';
import Quartets from './Quartets';

export const generateMetadata = () => pageMetadata(PageId.Home);

const ChorusProfile: FC<{ id: string, imageUrl: string | null, logoUrl: string | null }> = ({ id, imageUrl, logoUrl }) => (
    <a
        // This must be an a tag not a Link tag otherwise the prefetched CSS causes issues
        href={id.toLowerCase()}
        className="flex h-60 w-full items-center justify-center rounded-3xl bg-[length:100%] bg-[center_60%] duration-300 hover:bg-[length:110%] lg:h-96"
        style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${imageUrl ?? FALLBACK_IMAGE}')`,
        }}
    >
        {logoUrl ? <Image src={logoUrl} width={350} height={350} alt={`${id.toLowerCase()}-logo`} className="w-52 lg:w-64" /> : id}
    </a>
);

const EventProfile = ({ name, venueName, venueId, time, description, learnMoreUrl }: Pick<Event, 'name' | 'venueName' | 'venueId' | 'time' | 'description' | 'learnMoreUrl'>) => (
    <div className="rounded-3xl bg-hw-black px-8 py-6">
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
                <span>{time.toLocaleDateString(undefined, { timeZone: TIMEZONE })}</span>
                <span>{time.toLocaleTimeString(undefined, { timeStyle: 'short', timeZone: TIMEZONE }).toUpperCase()}</span>
            </a>
        </div>
        <p className="font-light text-hw-white">{description}</p>
        {learnMoreUrl && <a href={learnMoreUrl} target="_blank" className="text-hw-blue underline duration-200 hover:opacity-50" rel="noreferrer">Learn more</a>}
    </div>
);

export default async function HarmonyWaitahaHome() {
    const events = await prisma.event.findMany({
        select: {
            id: true,
            name: true,
            venueName: true,
            venueId: true,
            time: true,
            description: true,
            learnMoreUrl: true,
        },
        orderBy: {
            time: 'asc',
        },
    });

    const choruses = await prisma.chorus.findMany({
        select: {
            id: true,
            imageUrl: true,
            page: {
                select: {
                    logoUrl: true,
                },
            },
        },
    });

    const quartets = await prisma.quartet.findMany();

    const pageContent = await prisma.page.findFirstOrThrow({
        where: { id: PageId.Home },
        select: {
            logoUrl: true,
            aboutParagraph: true,
            headerMediaUrl: true,
            recruitmentParagraph: true,
        },
    });

    return (
        <main className="[&>*]:font-poppins">
            <HWHeader logoUrl={pageContent.logoUrl} />
            <section id="home" className="relative h-screen w-screen overflow-hidden">
                <MediaRenderer url={pageContent.headerMediaUrl ?? FALLBACK_IMAGE} className="size-full" videoOveride={<VideoAudio url={pageContent.headerMediaUrl ?? FALLBACK_IMAGE} />} />
                <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center bg-black/50 lg:hidden">
                    {pageContent.logoUrl && <Image src={pageContent.logoUrl} className="" width={200} height={200} alt="logo" />}
                </div>
                <ScrollArrow />
            </section>

            <div className="flex justify-center">
                <div className="max-w-screen-2xl px-5 lg:px-20">
                    <section id="about" className="flex flex-col items-center gap-5 pt-16">
                        <span className="text-center font-c-gothic text-5xl font-medium">
                            Welcome to Harmony Waitaha
                        </span>
                        <span className="text-center text-3xl font-semibold">
                            <span className="text-hw-red">Anyone</span>
                            {' '}
                            can
                            {' '}
                            <span className="text-hw-blue">learn</span>
                            <br className="inline lg:hidden" />
                            {' '}
                            <span className="text-hw-red">anyone</span>
                            {' '}
                            can
                            {' '}
                            <span className="text-hw-blue">sing</span>
                        </span>
                        <p>
                            {pageContent.aboutParagraph}
                        </p>
                    </section>
                    <section id="choruses" className="mt-10 space-y-5">
                        <span className="text-4xl font-semibold">Choruses</span>
                        <div className="grid gap-5 lg:grid-cols-2">
                            {choruses.map((chorus) => <ChorusProfile key={chorus.id} id={chorus.id} imageUrl={chorus.imageUrl} logoUrl={chorus.page.logoUrl} />)}
                        </div>
                    </section>
                    <section id="quartets" className="mt-10 space-y-5">
                        <span className="text-4xl font-semibold">Quartets</span>
                        <div className="grid gap-5 lg:grid-cols-3">
                            <Quartets quartets={quartets} />
                            {quartets.length === 0 && (
                                <span>Hmm, we couldn't find any quartets at this time, perhaps you should form one yourself!</span>
                            )}
                        </div>
                    </section>
                    <section id="events" className="mt-10 space-y-5">
                        <span className="text-4xl font-semibold">Upcoming Events</span>
                        <div className="grid w-full gap-5 lg:grid-cols-3">
                            {events.map(({ id, ...event }) => (
                                <EventProfile key={id} {...event} />
                            ))}
                            {events.length === 0 && (
                                <span>There are no scheduled events at this time, check again at a later date for any new developments!</span>
                            )}
                        </div>
                    </section>
                    <section id="contact" className="mt-10 space-y-5">
                        <span className="text-4xl font-semibold">Join Us Today!</span>
                        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-5">
                            <div className="col-span-2 mb-5 rounded-3xl p-0 lg:mb-0">
                                <p>
                                    {pageContent.recruitmentParagraph}
                                </p>
                            </div>
                            <div className="rounded-3xl bg-hw-black">
                                <div className="grid grid-cols-1 gap-5 p-8">
                                    <a
                                        className="flex items-center [&>*]:duration-200 [&>*]:hover:opacity-50"
                                        href={googleMapsLocationUrl('3 Brake Street', 'ChIJOYKExbeKMW0Ri4BKBGW0jm8')}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <MdLocationPin size={20} />
                                        <div>
                                            <p className="ml-2 text-hw-white">Upper Ricarton Methodist Church</p>
                                            <p className="ml-2 text-hw-white">3 Brake Street, Riccarton, Christchurch</p>
                                        </div>
                                    </a>
                                    <a className="flex items-center [&>*]:duration-200 [&>*]:hover:opacity-50" href="tel:+642123456789">
                                        <MdPhone size={20} />
                                        <span className="ml-2 text-hw-white">+64 211 427 668</span>
                                    </a>
                                    <a className="flex items-center [&>*]:duration-200 [&>*]:hover:opacity-50" href="mailto:enquire@harmonywaitaha.co.nz">
                                        <MdEmail size={20} />
                                        <span className="ml-2 text-hw-white">enquire@harmonywaitaha.co.nz</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer className="my-10 flex justify-between">
                        <div>
                            {pageContent.logoUrl && <Image className="h-12 w-28" src={pageContent.logoUrl} alt="hw-logo" width={500} height={500} />}
                            <p className="mt-3">© Harmony Waitaha {new Date().getFullYear()}</p>
                        </div>
                        <div className="flex flex-col justify-end">
                            <a
                                href="https://www.harmonywaitaha.co.nz/dbpage.php?pg=membersonly"
                                target="_blank"
                                className="text-hw-blue underline duration-200 hover:opacity-50"
                                rel="noreferrer"
                            >
                                Members ↗
                            </a>
                        </div>
                    </footer>
                </div>
            </div>
        </main>
    );
}
