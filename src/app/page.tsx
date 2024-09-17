import Image from 'next/image';
import { FC } from 'react';
import { MdEmail, MdLocationPin, MdPhone } from 'react-icons/md';
import { google } from 'calendar-link';
import { prisma } from '@/common/prisma';
import { Event, Quartet } from '@prisma/client';
import Link from 'next/link';
import { DEFAULT_QUARTET_IMAGE } from '@/common/constants';

import './index.css';
import { googleMapsLocationUrl } from '@/components/utils';
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
        className="flex h-96 w-full items-center justify-center rounded-3xl bg-[length:100%] bg-[center_60%] duration-300 hover:bg-[length:110%]"
        style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${photo}')`,
        }}
    >
        <Image src={logo} width={350} height={350} alt={`${name.toLowerCase()}-logo`} />
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
        className="flex h-72 w-full flex-col justify-between rounded-3xl bg-[length:100%] bg-[center_60%] duration-300 hover:bg-[length:110%]"
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

    return (
        <main className="px-20 2xl:px-[12vw] [&>*]:font-poppins">
            <HWHeader />
            <section id="home" className="-mx-20 h-screen overflow-y-hidden 2xl:mx-[-12vw]">
                <video autoPlay muted loop>
                    <source src="/main.mp4" type="video/mp4" />
                </video>
            </section>

            <section id="about" className="flex flex-col items-center gap-5 py-16">
                <span className="font-c-gothic text-5xl font-medium">
                    Welcome to Harmony Waitaha
                </span>
                <span className="text-3xl font-semibold">
                    <span className="text-hw-red">Anyone</span>
                    {' '}
                    can
                    {' '}
                    <span className="text-hw-blue">learn</span>
                    {' '}
                    <span className="text-hw-red">anyone</span>
                    {' '}
                    can
                    {' '}
                    <span className="text-hw-blue">sing</span>
                </span>
                <p className="">
                    Harmony Waitaha is an umbrella organization encompassing two vibrant a cappella choruses based in Christchurch, New Zealand: the Canterbury Plainsmen and Quantum Acoustics.
                    These groups, united by their passion for barbershop style singing, offer unique experiences for singers and audiences alike.
                    The Canterbury Plainsmen, established in 1947, boasts a rich history and reputation for excellence in barbershop singing.
                    Their talented members, exceeding 50 men, mesmerize audiences with their precise harmonies and captivating performances.
                    Quantum Acoustics, on the other hand, presents a fresh perspective with a focus on diversity and inclusion.
                    This dynamic young group, composed of singers of various backgrounds, brings a contemporary energy to the barbershop scene.
                    <br />
                    <br />
                    Under the Harmony Waitaha banner, both choruses flourish, contributing to the vibrant cultural landscape of Christchurch.
                    They regularly perform at concerts, festivals, and community events, captivating audiences with their passion and talent.
                    Their commitment to excellence and innovation ensures their continued success,
                    while their dedication to inclusivity fosters a welcoming environment for singers of all ages and backgrounds.
                </p>
            </section>
            <section id="choruses" className="space-y-5">
                <span className="text-4xl font-semibold">Choruses</span>
                <div className="grid grid-cols-2 gap-5">
                    <ChorusProfile
                        name="Plainsmen"
                        photo="plainsmen-photo.jpg"
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
                <div className="grid grid-cols-3 gap-5">
                    {quartets.map((quartet) => (
                        <QuartetProfile key={quartet.id} {...quartet} />
                    ))}
                </div>
            </section>
            <section id="events" className="mt-10 space-y-5">
                <span className="text-4xl font-semibold">Upcoming Events</span>
                <div className="grid w-full grid-cols-3 gap-5">
                    {events.map(({ id, ...event }) => (
                        <EventProfile key={id} {...event} />
                    ))}
                </div>
            </section>
            <section id="contact" className="mt-10 space-y-5">
                <span className="text-4xl font-semibold">Contact Us</span>
                <div className="grid grid-cols-2 gap-5">
                    <div className="rounded-3xl bg-hw-black">
                        <div className="grid grid-cols-1 gap-5 p-8">
                            <span className="text-2xl text-hw-white">Information</span>
                            <div className="flex items-center">
                                <MdLocationPin size={20} />
                                <div>
                                    <p className="ml-2 text-hw-white">Upper Ricarton Methodist Church</p>
                                    <p className="ml-2 text-hw-white"> 3 Brake Street, Riccarton, Christchurch</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <MdPhone size={20} />
                                <span className="ml-2 text-hw-white">02123456789</span>
                            </div>
                            <div className="flex items-center">
                                <MdEmail size={20} />
                                <span className="ml-2 text-hw-white">enquire@harmonywaitaha.co.nz</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-3xl bg-hw-black p-8">
                        <form action="">
                            <div className="mb-3 grid grid-cols-2 gap-3">
                                <label htmlFor="name" className="block text-hw-white">Name
                                    <input id="name" type="text" placeholder="Enter your name" className="block w-full rounded-md bg-hw-white px-3 py-2 text-hw-black" />
                                </label>
                                <label htmlFor="email" className="block text-hw-white">Email
                                    <input id="name" type="text" placeholder="Enter your email" className="block w-full rounded-md bg-hw-white px-3 py-2 text-hw-black" />
                                </label>
                            </div>
                            <label htmlFor="message" className="block text-hw-white">Message
                                <textarea id="name" placeholder="Type your message" className="block h-24 w-full resize-none rounded-md bg-hw-white px-3 py-2 text-hw-black" />
                            </label>
                        </form>
                    </div>
                </div>
            </section>
            <footer className="my-10">
                <Image src="/hw-logo.svg" alt="hw-logo" width={150} height={0} />
                <p className="mt-3">© Harmony Waitaha {new Date().getFullYear()}</p>
            </footer>
        </main>
    );
}
