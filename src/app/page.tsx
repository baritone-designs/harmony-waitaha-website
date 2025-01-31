import Image from 'next/image';
import { FC } from 'react';
import { MdEmail, MdLocationPin, MdPhone } from 'react-icons/md';
import { google } from 'calendar-link';
import { prisma } from '@/common/prisma';
import { Event, PageType, ParagraphContentType, PrimaryMediaContentType, Quartet } from '@prisma/client';
import Link from 'next/link';
import { DEFAULT_QUARTET_IMAGE } from '@/common/constants';
import { ScrollArrow } from '@/components/ScrollArrow';

import './index.css';
import { googleMapsLocationUrl } from '@/components/utils';
import MediaRenderer from '@/components/MediaRenderer';
import HWHeader from './Header';

interface ChorusProfileProps {
    name: string;
    photo: string;
    logo: string;
}

const ChorusProfile: FC<ChorusProfileProps> = ({ name, photo, logo }) => (
    <a
        // This must be an a tag not a Link tag otherwise the prefetched CSS causes issues
        href={name.toLowerCase()}
        className="flex h-60 w-full items-center justify-center rounded-3xl bg-[length:100%] bg-[center_60%] duration-300 hover:bg-[length:110%] lg:h-96"
        style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${photo}')`,
        }}
    >
        <Image src={logo} width={350} height={350} alt={`${name.toLowerCase()}-logo`} className="w-52 lg:w-64" />
    </a>
);

const QuartetProfile = ({ id, name, imageUrl, logoUrl }: Pick<Quartet, 'id' | 'name' | 'imageUrl' | 'logoUrl'>) => (
    <Link
        href={{
            query: {
                quartet: id,
            },
        }}
        scroll={false}
        className="flex h-60 w-full flex-col justify-between rounded-3xl bg-[length:100%] bg-[center_60%] duration-300 hover:bg-[length:110%] lg:h-72"
        style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url('${imageUrl ?? DEFAULT_QUARTET_IMAGE}')`,
        }}
    >
        <div />
        <div className="mx-8 mb-5 flex h-10 items-center justify-between">
            <span className="text-xl text-hw-white">{name}</span>
            {logoUrl && <Image src={logoUrl} height={20} width={30} alt={`${id}-logo`} className="rounded-full" />}
        </div>
    </Link>
);

const EventProfile = ({ name, venueName, venueId, time, description }: Pick<Event, 'name' | 'venueName' | 'venueId' | 'time' | 'description'>) => (
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
                <span className="">{time.toLocaleDateString()}</span>
                <span className="">{time.toLocaleTimeString(undefined, { timeStyle: 'short' }).toUpperCase()}</span>
            </a>
        </div>
        <p className="font-light text-hw-white">{description}</p>
        <a href="/" className="text-hw-blue underline duration-200 hover:opacity-50">Learn more</a>
    </div>
);

export default async function HarmonyWaitahaHome() {
    const events = (await prisma.event.findMany({
        select: {
            id: true,
            name: true,
            venueName: true,
            venueId: true,
            time: true,
            description: true,
        },
    }));

    const quartets = (await prisma.quartet.findMany({
        select: {
            id: true,
            name: true,
            imageUrl: true,
            logoUrl: true,
        },
    }));

    const aboutParagraph = await prisma.paragraphContent.findFirst({ where: { page: PageType.Home, type: ParagraphContentType.About } });

    const headerMedia = (await prisma.primaryMediaContent.findFirst({ where: { page: PageType.Home, type: PrimaryMediaContentType.Header }, orderBy: { index: 'asc' } }))?.url;

    return (
        <main className="[&>*]:font-poppins">
            <HWHeader />
            <section id="home" className="relative h-screen w-screen overflow-hidden">
                <MediaRenderer url={headerMedia ?? DEFAULT_QUARTET_IMAGE} className="size-full" />

                <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center bg-black/50 lg:hidden">
                    <Image src="./hw-logo.svg" className="" width={200} height={200} alt="logo" />
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
                            {aboutParagraph?.content ?? 'Could not load content'}
                        </p>
                    </section>
                    <section id="choruses" className="mt-10 space-y-5">
                        <span className="text-4xl font-semibold">Choruses</span>
                        <div className="grid gap-5 lg:grid-cols-2">
                            <ChorusProfile
                                name="Plainsmen"
                                photo="plainsmen-photo_og.jpg"
                                logo="plainsmen-logo.svg"
                            />
                            <ChorusProfile
                                name="Qa"
                                photo="qa-photo.png"
                                logo="qa-logo.svg"
                            />
                        </div>
                    </section>
                    <section id="quartets" className="mt-10 space-y-5">
                        <span className="text-4xl font-semibold">Quartets</span>
                        <div className="grid gap-5 lg:grid-cols-3">
                            {quartets.map((quartet) => (
                                <QuartetProfile key={quartet.id} {...quartet} />
                            ))}
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
                        <span className="text-4xl font-semibold">Contact Us</span>
                        <div className="grid gap-5 lg:grid-cols-2">
                            <div className="rounded-3xl bg-hw-black">
                                <div className="grid grid-cols-1 gap-5 p-8">
                                    <span className="text-2xl text-hw-white">Information</span>
                                    <a
                                        className="flex items-center [&>*]:duration-200 [&>*]:hover:opacity-50"
                                        href={googleMapsLocationUrl('3 Brake Street', 'ChIJOYKExbeKMW0Ri4BKBGW0jm8')}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <MdLocationPin size={20} />
                                        <div>
                                            <p className="ml-2 text-hw-white">Upper Ricarton Methodist Church</p>
                                            <p className="ml-2 text-hw-white"> 3 Brake Street, Riccarton, Christchurch</p>
                                        </div>
                                    </a>
                                    <a className="flex items-center [&>*]:duration-200 [&>*]:hover:opacity-50" href="tel:+642123456789">
                                        <MdPhone size={20} />
                                        <span className="ml-2 text-hw-white">021 2345 6789</span>
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
                            <Image className="h-12 w-28" src="/hw-logo.svg" alt="hw-logo" width={500} height={500} />
                            <p className="mt-3">© Harmony Waitaha {new Date().getFullYear()}</p>
                        </div>
                        <div className="flex flex-col justify-end">
                            <a
                                href="https://www.harmonywaitaha.co.nz/dbpage.php?pg=membersonly"
                                target="_blank"
                                className="text-hw-blue underline duration-200 hover:opacity-50"
                                rel="noreferrer"
                            >
                                Members only site ↗
                            </a>
                        </div>
                    </footer>
                </div>
            </div>
        </main>
    );
}
