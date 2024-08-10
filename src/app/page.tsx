import Image from 'next/image';
import { FC } from 'react';
import { MdLocationPin } from 'react-icons/md';
import { google } from 'calendar-link';
import HWHeader from './Header';

import './index.css';

interface EventProfileProps {
    title: string;
    location: string;
    datetime: Date;
    description: string;
}

const EventProfile: FC<EventProfileProps> = ({ title, location, datetime, description }) => (
    <div className="rounded-3xl border-4 bg-hw-black p-5">
        <div className="mb-3 flex flex-row justify-between">
            <div>
                <span className="text-2xl text-hw-white">{title}</span>
                <a
                    className="flex flex-row items-center gap-2 [&>*]:duration-200 [&>*]:hover:opacity-50"
                    href={`https://www.google.com/maps/search/${location}`}
                    target="blank"
                >
                    <MdLocationPin />
                    <span className="text-hw-white">{location}</span>
                </a>
            </div>

            <a
                className="flex flex-col items-end [&>*]:text-hw-white [&>*]:duration-200 [&>*]:hover:opacity-50"
                href={google({
                    title,
                    description,
                    location,
                    start: datetime,
                    duration: [2, 'hour'],
                })}
                target="blank"
            >
                <span className="">{datetime.toLocaleDateString()}</span>
                <span className="">{datetime.toLocaleTimeString(undefined, { timeStyle: 'short' }).toUpperCase()}</span>
            </a>
        </div>
        <p className="font-light text-hw-white">{description}</p>
        <a href="/" className="text-hw-blue underline duration-200 hover:opacity-50">Learn more</a>
    </div>
);

export default function HarmonyWaitahaHome() {
    return (
        <main className="px-20 2xl:px-[12vw] [&>*]:font-poppins">
            <HWHeader />
            <section id="home" className="-mx-20 h-screen overflow-y-hidden 2xl:mx-[-12vw]">
                <video autoPlay muted loop>
                    <source src="/main.mp4" type="video/mp4" />
                </video>
            </section>

            <section id="about" className="flex flex-col items-center gap-5 py-16">
                <span className="text-5xl font-medium">Welcome to Harmony Waitaha</span>
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
                    <a
                        href="/plainsmen"
                        className="flex h-96 w-full items-center justify-center rounded-3xl bg-[length:100%] bg-[center_60%] duration-300 hover:bg-[length:110%]"
                        style={{
                            backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(\'/plainsmen-photo.jpg\')',
                        }}
                    >
                        <Image src="/plainsmen-large-logo.svg" width={350} height={350} alt="plainsmen-logo" />
                    </a>
                    <a
                        href="/qa"
                        className="flex h-96 w-full items-center justify-center rounded-3xl bg-[length:100%] bg-[center_60%] duration-300 hover:bg-[length:110%]"
                        style={{
                            backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(\'/qa-photo.png\')',
                        }}
                    >
                        <Image src="/qa-large-logo.svg" width={350} height={350} alt="qa-logo" />
                    </a>
                </div>
            </section>
            <section id="quartets" className="mt-10 space-y-5">
                <span className="text-4xl font-semibold">Quartets</span>
                <div className="grid grid-cols-3 gap-5">
                    <a
                        href="https://www.promenadequartet.co.nz/"
                        target="blank"
                        className="flex h-72 w-full flex-col justify-between rounded-3xl bg-[length:100%] bg-[center_60%] duration-300 hover:bg-[length:110%]"
                        style={{
                            backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(\'/promenade-photo.jpeg\')',
                        }}
                    >
                        <div />
                        <div className="mx-8 mb-5 flex h-10 items-center justify-between">
                            <span className="text-xl text-hw-white">Promenade</span>
                            <Image src="/promenade-logo.jpg" width={40} height={20} alt="promenade-logo" className="rounded-full" />
                        </div>
                    </a>
                    <a
                        href="https://www.doublebass.co.nz/"
                        target="blank"
                        className="flex h-72 w-full flex-col justify-between rounded-3xl bg-[length:100%] bg-[center_60%] duration-300 hover:bg-[length:110%]"
                        style={{
                            backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(\'/doublebass-photo.jpg\')',
                        }}
                    >
                        <div />
                        <div className="mx-8 mb-5 flex h-10 items-center justify-between">
                            <span className="text-xl text-hw-white">Double Bass</span>
                        </div>
                    </a>
                    <a
                        href="https://www.doublebass.co.nz/"
                        target="blank"
                        className="flex h-72 w-full flex-col justify-between rounded-3xl bg-[length:100%] bg-[center_60%] duration-300 hover:bg-[length:110%]"
                        style={{
                            backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(\'/defaultqt-photo.png\')',
                        }}
                    >
                        <div />
                        <div className="mx-8 mb-5 flex h-10 items-center justify-between">
                            <span className="text-xl text-hw-white">Class Act</span>
                        </div>
                    </a>
                </div>
            </section>
            <section id="events" className="mt-10 space-y-5">
                <span className="text-4xl font-semibold">Upcoming Events</span>
                <div className="flex w-full flex-row gap-5">
                    <EventProfile
                        title="Open night"
                        location="3 Brake Street"
                        description="Banana flavoured ice cream is a disease. We would love for you to nullam aliquam massa porta, suscipit urna a, fringilla sem.
                        Quisque sed viverra massa. Nulla sed ipsum erat. Donec maximus eget mauris nec elementum. Suspendisse pulvinar mi"
                        datetime={new Date()}
                    />
                    <EventProfile
                        title="Open night"
                        location="3 Brake Street"
                        description="Banana flavoured ice cream is a disease. We would love for you to nullam aliquam massa porta, suscipit urna a, fringilla sem.
                         Quisque sed viverra massa. Nulla sed ipsum erat. Donec maximus eget mauris nec elementum. Suspendisse pulvinar mi"
                        datetime={new Date()}
                    />
                    <EventProfile
                        title="Open night"
                        location="3 Brake Street"
                        description="Banana flavoured ice cream is a disease. We would love for you to nullam aliquam massa porta, suscipit urna a, fringilla sem.
                        Quisque sed viverra massa. Nulla sed ipsum erat. Donec maximus eget mauris nec elementum. Suspendisse pulvinar mi"
                        datetime={new Date()}
                    />
                </div>
            </section>
            <section id="contact" className="" />
        </main>
    );
}
