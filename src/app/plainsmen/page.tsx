import Image from 'next/image';
import { MediaCarousel } from '@/components/Carousel';
import { FC } from 'react';
import { ChorusId, PageId } from '@prisma/client';
import { prisma } from '@/common/prisma';
import { MapComponent } from '@/components/map';
import { IconType } from 'react-icons';
import { ScrollArrow } from '@/components/ScrollArrow';
import ScrollImage from '@/components/ScrollImage';
import MediaRenderer from '@/components/MediaRenderer';
import { FALLBACK_IMAGE, SOCIALS_ICONS, SOCIALS_PREFIX } from '@/common/constants';
import clsx from 'clsx';
import pageMetadata from '@/components/pageMetadata';
import PlainsmenHeader from './Header';
import './index.css';
import People from './People';
import EventProfile from './EventProfile';

export const generateMetadata = () => pageMetadata(PageId.Plainsmen);

interface SocialLinkProps {
    href: string;
    icon: IconType;
}

const SocialLink: FC<SocialLinkProps> = ({ href, icon: Icon }) => (
    <a href={href} target="_blank" rel="noreferrer" className="duration-200 hover:text-pm-blue">
        <Icon size={25} />
    </a>
);

export default async function PlainsmenHome() {
    const { socials, page: { iconUrl, logoUrl, aboutParagraph, carouselMediaUrls, headerMediaUrl, recruitmentParagraph } } = await prisma.chorus.findFirstOrThrow({
        where: {
            id: ChorusId.Plainsmen,
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
            chorusId: ChorusId.Plainsmen,
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
                    id: ChorusId.Plainsmen,
                },
            },
        },
    }));

    return (
        <main className="bg-hw-black [&>*]:font-poppins">
            <PlainsmenHeader iconUrl={iconUrl} />
            <section id="home" className="relative h-screen">
                <div className="z-10 flex h-full items-center justify-center text-8xl font-medium">
                    {logoUrl && <Image src={logoUrl} alt="plainsmen-logo" width={500} height={500} className="z-10 h-32 lg:h-52" />}
                </div>
                <div className="pointer-events-none absolute inset-0">
                    <MediaRenderer
                        className="size-full"
                        url={headerMediaUrl ?? FALLBACK_IMAGE}
                        imageOveride={<ScrollImage url={headerMediaUrl ?? FALLBACK_IMAGE} className="opacity-30" />}
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
                                    {aboutParagraph}
                                </p>
                                <div className="z-0 mt-4 grid grid-cols-2 items-center gap-1 lg:grid-cols-3 lg:gap-14">
                                    <People people={people} />
                                </div>
                            </div>
                            <div className="flex flex-col justify-between">
                                <MediaCarousel className="z-10 aspect-auto w-full rounded-xl" mediaUrls={carouselMediaUrls} />
                            </div>
                        </div>
                    </section>

                    <section id="events" className="mb-10 space-y-4">
                        <span className="text-4xl font-semibold text-pm-blue">Upcoming Events</span>
                        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
                            {events.map(({ id, ...event }) => (
                                <EventProfile key={id} {...event} />
                            ))}
                            {events.length === 0 && (
                                <span>
                                    The Plainsmen have no scheduled events at this time, click
                                    {' '}
                                    <a href="/#events" className="text-pm-blue duration-200 hover:opacity-50">
                                        here
                                    </a>
                                    {' '}
                                    to see events for all of Harmony Waitaha
                                </span>
                            )}
                        </div>
                    </section>

                    <section id="join" className="mb-20 space-y-4">
                        <span className="text-4xl font-semibold text-pm-blue">Sing With Us!</span>
                        <div className="w-full gap-5 lg:flex lg:flex-row">
                            <div className="lg:w-2/3">
                                <p>
                                    {recruitmentParagraph}
                                </p>
                            </div>
                            <MapComponent />
                        </div>
                    </section>
                    <section id="footer" className="mb-10 flex flex-row items-end justify-between">
                        <div className={clsx(Object.values(socials).filter((x) => !!x).length === 0 && 'invisible')}>
                            <span className="text-4xl font-semibold text-pm-blue">Follow Us</span>
                            <div className="mt-2 flex gap-3 text-white">
                                {Object.entries(socials)
                                    .map(([key, value]) => value && (
                                        <SocialLink
                                            key={key}
                                            icon={SOCIALS_ICONS[key as keyof typeof SOCIALS_ICONS]}
                                            href={SOCIALS_PREFIX[key as keyof typeof SOCIALS_PREFIX] + value}
                                        />
                                    ))}
                            </div>
                        </div>
                        <a className="hidden h-full flex-col items-center text-pm-blue duration-200 hover:opacity-50 lg:flex" href="/" target="_blank">
                            Harmony Waitaha Website ↗
                        </a>
                        <div className="flex flex-col items-end">
                            {logoUrl && <Image src={logoUrl} alt="plainsmen-logo" width={100} height={100} />}
                            <span>© Plainsmen {new Date().getFullYear()}</span>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
