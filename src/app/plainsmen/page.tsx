import { Metadata } from 'next';
import Image from 'next/image';
import { CustomCarousel } from '@/components/Carousel';
import { FaFacebook } from 'react-icons/fa';
import { FC } from 'react';
import Link from 'next/link';
import { ChorusId, Person, Event } from '@prisma/client';
import { prisma } from '@/common/prisma';
import { googleMapsLocationUrl } from '@/components/utils';
import { google } from 'calendar-link';
import { MdLocationPin } from 'react-icons/md';
import { MapComponent } from '@/components/map';
import { IconType } from 'react-icons';

import { ScrollImage } from './ScrollImage';
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
        <div className="h-40 w-40 rounded-xl bg-cover bg-center duration-200" style={{ backgroundImage: `url('${iconUrl}')` }} />
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
    return (
        <main className="bg-hw-black px-20 2xl:px-[10vw]">
            <PlainsmenHeader />

            <section id="home" className="relative h-screen">
                <div className="z-10 flex h-full items-center justify-center text-8xl font-medium">
                    <Image src="/plainsmen-logo.svg" alt="plainsmen-logo" width={500} height={500} className="z-10" />
                </div>
                <div className="pointer-events-none absolute -inset-x-20 inset-y-0 2xl:inset-x-[-10vw]">
                    <ScrollImage />
                </div>
            </section>

            <section id="about" className="my-10 space-y-4">
                <span className="text-4xl font-semibold text-pm-blue">About Us</span>
                <div className="grid grid-cols-2 gap-20">
                    <div>
                        <p className="z-10">
                            We are a Barbershop Chorus located in Christchurch, New Zealand that perform a wide range of music blah lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed maximus semper lectus fa dfaf asdfasdf f adf asdfasdfasdf asdf asdf a dfasdf asdf asdfasdfringilla rhoncus.
                            In non mauris lorem. Nullam aliquam massa porta, suscipit
                        </p>
                        <div className="z-0 mt-4 grid grid-cols-3 items-center gap-14">
                            {people.map((person) => (
                                <TeamProfile key={person.id} {...person} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col justify-between">
                        <CustomCarousel className="z-10 h-96 rounded-xl" />
                    </div>
                </div>
            </section>

            <section id="events" className="mb-10 space-y-4">
                <span className="text-4xl font-semibold text-pm-blue">Upcoming Events</span>
                <div className="grid w-full grid-cols-3 gap-5">
                    {events.map(({ id, ...event }) => (
                        <EventProfile key={id} {...event} />
                    ))}
                </div>
            </section>

            <section id="join" className="mb-20 space-y-4">
                <span className="text-4xl font-semibold text-pm-blue">Sing With Us!</span>
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
                    <span className="text-4xl font-semibold text-pm-blue">Follow Us</span>
                    <div className="mt-2 flex gap-3 text-white">
                        <SocialLink icon={FaFacebook} href="https://www.facebook.com/qachorus/" size={25} />
                    </div>
                </div>
                <a className="flex h-full flex-col items-center text-pm-blue duration-200 hover:opacity-50" href="/" target="_blank">
                    Harmony Waitaha Website ↗
                </a>
                <div className="flex flex-col items-end">
                    <Image src="/plainsmen-logo.svg" alt="qa-logo/" width={100} height={100} />
                    <span>© Plainsmen {new Date().getFullYear()}</span>
                </div>
            </section>
        </main>
    );
}
