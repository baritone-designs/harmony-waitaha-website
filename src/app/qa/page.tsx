import { ScrollImage } from '@/app/qa/ScrollImage';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
// import { IoChevronDown } from 'react-icons/io5';
// import { MotionA } from '@/components/Motion';
import Image from 'next/image';
import { MapComponent } from '@/components/map';

import { FC } from 'react';
import { IconType } from 'react-icons';
import { Metadata } from 'next';

import './index.css';
import { MdLocationPin } from 'react-icons/md';
import { google } from 'calendar-link';
import { prisma } from '@/common/prisma';
import { ChorusId, Event, Person } from '@prisma/client';
// import qaLogo from './qa-logo.svg';
import { googleMapsLocationUrl } from '@/components/utils';
import Link from 'next/link';
import { CustomCarousel } from '@/components/Carousel';
import QAHeader from './Header';

export const metadata: Metadata = {
    title: 'Quantum Acoustics',
    description: 'Youth barbershop mixed chorus from Christchurch, New Zealand',
};

const TeamProfile = ({ id, iconUrl, name, role }: Pick<Person, 'id' | 'iconUrl' | 'name'> & { role: string }) => (
    <Link
        href={{
            query: {
                person: id,
            },
        }}
        scroll={false}
        className="group flex flex-col items-center rounded-3xl border-2 border-transparent p-1 duration-200 hover:scale-105 lg:p-4"
    >
        <div className="h-40 w-40 rounded-full bg-cover bg-center duration-200" style={{ backgroundImage: `url('${iconUrl}')` }} />
        <span className="mt-5 text-center text-lg font-medium duration-200 group-hover:text-qa-blue group-hover:drop-shadow-qa-glow-light">{name}</span>
        <span className="text-center font-pt-sans text-sm">{role}</span>
    </Link>
);

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
    size?: number;
    className: string;
}

const SocialLink: FC<SocialLinkProps> = ({ href, icon: Icon, size = 45, className }) => (
    <a href={href} target="_blank" rel="noreferrer" className="duration-200 hover:text-qa-blue hover:drop-shadow-qa-glow-intense">
        <Icon size={size} className={className} />
    </a>
);

export default async function QAHome() {
    const people = (await prisma.personChorus.findMany({
        where: {
            chorusId: ChorusId.Qa,
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
                    id: ChorusId.Qa,
                },
            },
        },
    }));

    return (
        <main className="[&>*]:font-pt-sans">
            <QAHeader />
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
                                    <div className="mt-2 flex gap-4 text-white lg:mt-6">
                                        <SocialLink icon={FaInstagram} href="https://www.instagram.com/qachorus" className="w-6 lg:w-14" />
                                        <SocialLink icon={FaTiktok} href="https://www.tiktok.com/@qachorus" className="w-6 lg:w-14" />
                                        <SocialLink icon={FaFacebook} href="https://www.facebook.com/qachorus/" className="w-6 lg:w-14" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pointer-events-none absolute left-0 top-0 z-0 h-screen w-screen overflow-hidden bg-black lg:bg-qa-blue-darker">
                    <ScrollImage />
                    <Image src="/qa-photo.png" width={2000} height={2000} alt="bg-image" className="visible h-screen object-cover opacity-40 lg:invisible" />
                </div>
            </section>
            <div className="flex justify-center">
                <div className="w-full max-w-screen-2xl px-5 lg:px-20">
                    <section id="about" className="mb-10 space-y-4">
                        <span className="text-4xl font-semibold text-qa-blue">About Us</span>
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-20">
                            <p className="z-10">
                                We are a Barbershop Chorus located in Christchurch, New Zealand that perform a wide range of music blah lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Sed maximus semper lectus fa dfaf asdfasdf f adf asdfasdfasdf asdf asdf a dfasdf asdf asdfasdfringilla rhoncus.
                                In non mauris lorem. Nullam aliquam massa porta, suscipit urna a, fringilla sem. Quisque sed viverra massa. Nulla sed ipsum erat.
                                Donec maximus eget mauris nec elementum. Suspendisse pulvinar mi nisi, eget venenatis felis.
                                <br />
                                <br />
                                We are a Barbershop Chorus located in Christchurch, New Zealand that perform a wide range of music blah lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Sed maximus semper lectus fa dfaf asdfasdf f adf asdfasdfasdf asdf asdf a dfasdf asdf asdfasdfringilla rhoncus.
                                In non mauris lorem. Nullam aliquam massa porta, suscipit urna a, fringilla sem. Quisque sed viverra massa. Nulla sed ipsum erat.
                                Donec maximus eget mauris nec elementum. Suspendisse pulvinar mi nisi, eget venenatis felis.
                            </p>
                            <div className="">
                                <CustomCarousel className="z-10 aspect-video w-full rounded-3xl" />
                            </div>
                        </div>
                        <div className="invisible flex w-full justify-center lg:visible">
                            <div className="mb-1 h-0.5 w-60 rounded-full bg-qa-white lg:mt-4" />
                        </div>
                        <div className="flex w-full justify-center">
                            <div className="z-0 grid grid-cols-2 items-center justify-between gap-3 lg:flex lg:flex-row lg:gap-14">
                                {people.map((person) => (
                                    <TeamProfile key={person.id} {...person} />
                                ))}
                            </div>
                        </div>
                    </section>
                    <section id="events" className="mb-10 space-y-4">
                        <span className="text-4xl font-semibold text-qa-blue">Upcoming Events</span>
                        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
                            {events.map(({ id, ...event }) => (
                                <EventProfile key={id} {...event} />
                            ))}
                        </div>
                    </section>
                    {/* <section id="media" className="space-y-4">
                <span className="text-4xl font-semibold text-qa-blue">Media</span>
                <div className="scrollbar-hidden -mx-20 overflow-x-scroll 2xl:mx-[-10vw]">
                    <div className="mx-20 flex w-max flex-row gap-10 2xl:mx-[10vw]">
                        <div className="h-80 w-80 rounded-3xl bg-black" />
                        <div className="h-80 w-80 rounded-3xl bg-black" />
                        <div className="h-80 w-80 rounded-3xl bg-black" />
                        <div className="h-80 w-80 rounded-3xl bg-black" />
                        <div className="h-80 w-80 rounded-3xl bg-black" />
                        <div className="h-80 w-80 rounded-3xl bg-black" />
                    </div>
                </div>
            </section> */}
                    <section id="join" className="mb-20 space-y-4">
                        <span className="text-4xl font-semibold text-qa-blue">Wanna Join?</span>
                        <div className="w-full gap-5 lg:flex lg:flex-row">
                            <div className="lg:w-2/3">
                                <p>
                                    We are a Barbershop Chorus located in Christchurch, New Zealand that perform a wide
                                    range of music blah lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus
                                    semper lectus fa dfaf asdfasdf f adf asdfasdfasdf asdf asdf a dfasdf asdf asdfasdfringilla
                                    rhoncus. In non mauris lorem. Nullam aliquam massa porta, suscipit urna a, fringilla sem.
                                    Quisque sed viverra massa. Nulla sed ipsum erat. Donec maximus eget mauris nec
                                    elementum. Suspendisse pulvinar mi nisi, eget venenatis felis tempor vitae.
                                </p>
                            </div>
                            <MapComponent />
                        </div>
                    </section>
                    <section id="footer" className="mb-5 flex flex-row items-end justify-between lg:mb-10">
                        <div>
                            <span className="text-4xl font-semibold text-qa-blue">Follow Us</span>
                            <div className="mt-0 flex gap-4 text-white lg:mt-1">
                                <SocialLink icon={FaInstagram} href="https://www.instagram.com/qachorus" className="w-5 lg:w-7" />
                                <SocialLink icon={FaTiktok} href="https://www.tiktok.com/@qachorus" className="w-5 lg:w-7" />
                                <SocialLink icon={FaFacebook} href="https://www.facebook.com/qachorus/" className="w-5 lg:w-7" />
                            </div>
                        </div>
                        <a className="hidden h-full flex-col items-center text-qa-blue duration-200 hover:drop-shadow-qa-glow-intense lg:flex" href="/" target="_blank">
                            Harmony Waitaha Website ↗
                        </a>
                        <div className="flex flex-col items-end">
                            <Image src="/qa-logo.svg" alt="qa-logo/" width={150} height={150} className="w-32" />
                            <span>© Quantum Acoustics {new Date().getFullYear()}</span>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
