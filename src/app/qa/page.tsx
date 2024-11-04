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
        className="group flex flex-col items-center rounded-3xl border-2 border-transparent p-4 duration-200 hover:scale-105"
    >
        <div className="h-40 w-40 rounded-full bg-cover bg-center duration-200" style={{ backgroundImage: `url('${iconUrl}')` }} />
        <span className="mt-5 text-lg font-medium duration-200 group-hover:text-qa-blue group-hover:drop-shadow-qa-glow-light">{name}</span>
        <span className="font-pt-sans text-sm">{role}</span>
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
}

const SocialLink: FC<SocialLinkProps> = ({ href, icon: Icon, size = 45 }) => (
    <a href={href} target="_blank" rel="noreferrer" className="duration-200 hover:text-qa-blue hover:drop-shadow-qa-glow-intense">
        <Icon size={size} />
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
        <main className="px-20 2xl:px-[10vw]">
            <QAHeader />
            <section id="home" className="relative flex h-screen flex-col justify-center">
                <div className="z-10 flex flex-col text-8xl font-medium">
                    <span>
                        <span className="font-semibold text-qa-blue drop-shadow-qa-glow-light">Q</span>
                        <span>uantum</span>
                    </span>
                    <span>
                        <span className="font-semibold text-qa-blue drop-shadow-qa-glow-light">A</span>
                        <span>coustics</span>
                    </span>
                    <div className="mt-6 flex gap-5 text-white">
                        <SocialLink icon={FaInstagram} href="https://www.instagram.com/qachorus" />
                        <SocialLink icon={FaTiktok} href="https://www.tiktok.com/@qachorus" />
                        <SocialLink icon={FaFacebook} href="https://www.facebook.com/qachorus/" />
                    </div>
                </div>
                <div className="pointer-events-none absolute -inset-x-20 inset-y-0 z-0 2xl:inset-[-10vw]">
                    <ScrollImage />
                </div>
                {/* <MotionA
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5, ease: 'easeIn' }}
                    animate={{ transform: ['translate(-50%, 0)', 'translate(-50%, 20px)'] }}
                    className="absolute bottom-10 left-1/2"
                    href="#about"
                >
                    <IoChevronDown size={45} className="text-white duration-200 hover:text-qa-blue" />
                </MotionA> */}
            </section>
            <section id="about" className="mb-10 space-y-4">
                <span className="text-4xl font-semibold text-qa-blue">About Us</span>
                <div className="grid grid-cols-2 gap-20">
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
                    <div className="flex flex-col justify-between">
                        <CustomCarousel className="z-10 h-96 rounded-3xl" />
                    </div>
                </div>
                <div className="flex w-full justify-center">
                    <div className="mb-1 mt-4 h-0.5 w-60 rounded-full bg-qa-white" />
                </div>
                <div className="flex w-full justify-center">
                    <div className="z-0 flex flex-row items-center justify-between gap-14">
                        {people.map((person) => (
                            <TeamProfile key={person.id} {...person} />
                        ))}
                    </div>
                </div>
            </section>
            <section id="upcoming" className="mb-10 space-y-4">
                <span className="text-4xl font-semibold text-qa-blue">Upcoming Events</span>
                <div className="grid w-full grid-cols-3 gap-5">
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
                <div className="flex w-full flex-row gap-5">
                    <div className="w-2/3">
                        <p>
                            We are a Barbershop Chorus located in Christchurch, New Zealand that perform a wide
                            range of music blah lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus
                            semper lectus fa dfaf asdfasdf f adf asdfasdfasdf asdf asdf a dfasdf asdf asdfasdfringilla
                            rhoncus. In non mauris lorem. Nullam aliquam massa porta, suscipit urna a, fringilla sem.
                            Quisque sed viverra massa. Nulla sed ipsum erat. Donec maximus eget mauris nec
                            elementum. Suspendisse pulvinar mi nisi, eget venenatis felis tempor vitae. In commodo
                            risus lacus, et egestas nibh lacinia vitae. We are a Barbershop Chorus located in
                            Christchurch, New Zealand that perform a wide range of music blah lorem ipsum dolor sit
                            amet, consectetur adipiscing elit Sed maximus semper lectus fa dfaf asdfasdf f adf
                            asdfasdfasdf asdf asdf a dfasdf asdf asdfasdfringilla rhoncus. In non mauris lorem.Donec
                            asdfasdf f adf asdfasdfasdf asdf asdf a dfasdf asdf asdfasdfringilla
                            rhoncus. In non mauris lorem. Nullam aliquam massa porta, suscipit urna a, fringilla sem.
                            Quisque sed viverra massa. Nulla sed ipsum erat. Donec maximus eget mauris nec
                            elementum. Suspendisse pulvinar mi nisi, eget venenatis felis tempor vitae. In commodo
                            risus lacus, et egestas nibh lacinia vitae. We are a Barbershop Chorus located in
                            Christchurch, New Zealand that perform a wide range of music blah lorem ipsum dolor sit
                            amet, consectetur adipiscing elit Sed maximus semper lectus fa dfaf asdfasdf f adf
                            asdfasdfasdf asdf asdf a dfasdf asdf asdfasdfringilla rhoncus. In non mauris lorem.Donec
                        </p>
                    </div>
                    <MapComponent />
                </div>
            </section>
            <section id="footer" className="mb-10 flex flex-row items-end justify-between">
                <div>
                    <span className="text-4xl font-semibold text-qa-blue">Follow Us</span>
                    <div className="mt-2 flex gap-3 text-white">
                        <SocialLink icon={FaInstagram} href="https://www.instagram.com/qachorus" size={25} />
                        <SocialLink icon={FaTiktok} href="https://www.tiktok.com/@qachorus" size={25} />
                        <SocialLink icon={FaFacebook} href="https://www.facebook.com/qachorus/" size={25} />
                    </div>
                </div>
                <a className="flex h-full flex-col items-center text-qa-blue duration-200 hover:drop-shadow-qa-glow-intense" href="/" target="_blank">
                    Harmony Waitaha Website ↗
                </a>
                <div className="flex flex-col items-end">
                    <Image src="/qa-logo.svg" alt="qa-logo/" width={150} height={150} />
                    <span>© Quantum Acoustics {new Date().getFullYear()}</span>
                </div>
            </section>
        </main>
    );
}
