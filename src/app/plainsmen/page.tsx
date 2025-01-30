import { Metadata } from 'next';
import Image from 'next/image';
import { MediaCarousel } from '@/components/Carousel';
import { FaFacebook } from 'react-icons/fa';
import { FC } from 'react';
import Link from 'next/link';
import { ChorusId, Person, Event, ParagraphContentType, PageType, PrimaryMediaContentType } from '@prisma/client';
import { prisma } from '@/common/prisma';
import { googleMapsLocationUrl } from '@/components/utils';
import { google } from 'calendar-link';
import { MdLocationPin } from 'react-icons/md';
import { MapComponent } from '@/components/map';
import { IconType } from 'react-icons';
import { ScrollArrow } from '@/components/ScrollArrow';
import ScrollImage from '@/components/ScrollImage';
import MediaRenderer from '@/components/MediaRenderer';
import { DEFAULT_QUARTET_IMAGE } from '@/common/constants';
import PlainsmenHeader from './Header';
import './index.css';

export const metadata: Metadata = {
    title: 'The Plainsmen',
    description: 'Barbershop mens chorus from Christchurch, New Zealand',
};

const TeamProfile = ({ id, iconUrl, name, role }: Pick<Person, 'id' | 'iconUrl' | 'name'> & { role: string }) => (
    <Link
        href={{
            query: {
                person: id,
            },
        }}
        scroll={false}
        className="group flex flex-col items-center rounded-3xl border-2 border-transparent p-4 duration-200 hover:opacity-50"
    >
        <div className="size-40 rounded-xl bg-cover bg-center duration-200" style={{ backgroundImage: `url('${iconUrl}')` }} />
        <span className="mt-5 text-lg font-medium duration-200">{name}</span>
        <span className="font-pt-sans text-sm">{role}</span>
    </Link>
);

const EventProfile = ({ name, venueName, venueId, time, description }: Pick<Event, 'name' | 'venueName' | 'venueId' | 'time' | 'description'>) => (
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
                <span className="">{time.toLocaleDateString()}</span>
                <span className="">{time.toLocaleTimeString(undefined, { timeStyle: 'short' }).toUpperCase()}</span>
            </a>
        </div>
        <p className="font-light text-hw-white">{description}</p>
        <a href="/" className="text-pm-blue underline duration-200 hover:opacity-50">Learn more</a>
    </div>
);

interface SocialLinkProps {
    href: string;
    icon: IconType;
    size?: number;
}

const SocialLink: FC<SocialLinkProps> = ({ href, icon: Icon, size = 45 }) => (
    <a href={href} target="_blank" rel="noreferrer" className="duration-200 hover:text-pm-blue">
        <Icon size={size} />
    </a>
);

export default async function PlainsmenHome() {
    const people = (await prisma.personChorus.findMany({
        where: {
            chorusId: ChorusId.Plainsmen,
        },
        include: {
            person: {
                select: {
                    id: true,
                    name: true,
                    iconUrl: true,
                },
            },
        },
    })).map((x) => ({
        role: x.role,
        ...x.person,
    }));

    const events = (await prisma.event.findMany({
        where: {
            choruses: {
                some: {
                    id: ChorusId.Plainsmen,
                },
            },
        },
    }));

    const paragraphContent = await prisma.paragraphContent.findMany({ where: { page: PageType.Plainsmen } });

    const aboutParagraph = paragraphContent.find(({ type }) => type === ParagraphContentType.About);
    const recruitmentParagraph = paragraphContent.find(({ type }) => type === ParagraphContentType.Recruitment);

    const headerMedia = (await prisma.primaryMediaContent.findFirst({ where: { page: PageType.Plainsmen, type: PrimaryMediaContentType.Header }, orderBy: { index: 'asc' } }))?.url;
    const carouselMedia = (await prisma.primaryMediaContent.findMany({ where: { page: PageType.Plainsmen, type: PrimaryMediaContentType.Carousel }, orderBy: { index: 'asc' } }))
        .map(({ url }) => url);

    return (
        <main className="bg-hw-black [&>*]:font-poppins">
            <PlainsmenHeader />

            <section id="home" className="relative h-screen">
                <div className="z-10 flex h-full items-center justify-center text-8xl font-medium">
                    <Image src="/plainsmen-logo.svg" alt="plainsmen-logo" width={500} height={500} className="z-10 h-32 lg:h-52" />
                </div>
                <div className="pointer-events-none absolute inset-0">
                    <MediaRenderer
                        className="size-full"
                        url={headerMedia ?? DEFAULT_QUARTET_IMAGE}
                        imageOveride={<ScrollImage url={headerMedia ?? DEFAULT_QUARTET_IMAGE} className="opacity-30" />}
                    />
                </div>
                <ScrollArrow />
            </section>

            <div className="flex justify-center">
                <div className="w-full max-w-screen-2xl px-5 lg:px-20">
                    <section id="about" className="my-10 space-y-4">
                        <span className="text-4xl font-semibold text-pm-blue">About Us</span>
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-20">
                            <div>
                                <p className="z-10">
                                    {aboutParagraph?.content ?? 'Could not load content'}
                                </p>
                                <div className="z-0 mt-4 grid grid-cols-2 items-center gap-1 lg:grid-cols-3 lg:gap-14">
                                    {people.map((person) => (
                                        <TeamProfile key={person.id} {...person} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col justify-between">
                                <MediaCarousel className="z-10 aspect-auto w-full rounded-xl" mediaUrls={carouselMedia} />
                            </div>
                        </div>
                    </section>

                    <section id="events" className="mb-10 space-y-4">
                        <span className="text-4xl font-semibold text-pm-blue">Upcoming Events</span>
                        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
                            {events.map(({ id, ...event }) => (
                                <EventProfile key={id} {...event} />
                            ))}
                        </div>
                    </section>

                    <section id="join" className="mb-20 space-y-4">
                        <span className="text-4xl font-semibold text-pm-blue">Sing With Us!</span>
                        <div className="w-full gap-5 lg:flex lg:flex-row">
                            <div className="lg:w-2/3">
                                <p>
                                    {recruitmentParagraph?.content ?? 'Could not load content'}
                                </p>
                            </div>
                            <MapComponent />
                        </div>
                    </section>
                    <section id="footer" className="mb-10 flex flex-row items-end justify-between">
                        <div>
                            <span className="text-4xl font-semibold text-pm-blue">Follow Us</span>
                            <div className="mt-2 flex gap-3 text-white">
                                <SocialLink icon={FaFacebook} href="https://www.facebook.com/qachorus/" size={25} />
                            </div>
                        </div>
                        <a className="hidden h-full flex-col items-center text-pm-blue duration-200 hover:opacity-50 lg:flex" href="/" target="_blank">
                            Harmony Waitaha Website ↗
                        </a>
                        <div className="flex flex-col items-end">
                            <Image src="/plainsmen-logo.svg" alt="qa-logo/" width={100} height={100} />
                            <span>© Plainsmen {new Date().getFullYear()}</span>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
