import { ScrollImage } from '@/app/qa/ScrollImage';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
// import { IoChevronDown } from 'react-icons/io5';
// import { MotionA } from '@/components/Motion';
import Image from 'next/image';

import { FC } from 'react';
import { IconType } from 'react-icons';
import { Metadata } from 'next';
import qaWave from '@/assets/images/qa-wave.png';

import './index.css';
import { MdLocationPin } from 'react-icons/md';
import QAHeader from './Header';

export const metadata: Metadata = {
    title: 'Quantum Acoustics',
    description: 'Youth barbershop mixed chorus from Christchurch, New Zealand',
};

interface TeamProfileProps {
    image: string;
    name: string;
    title: string;
}

const TeamProfile: FC<TeamProfileProps> = ({ image, name, title }) => (
    <a href="/" className="group flex flex-col items-center rounded-3xl border-2 border-transparent p-4 duration-200 hover:scale-105 hover:shadow-lg">
        <div className="h-40 w-40 rounded-full bg-cover bg-center duration-200" style={{ backgroundImage: `url('${image}')` }} />
        <span className="mt-5 text-lg font-medium duration-200 group-hover:text-qa-blue group-hover:drop-shadow-qa-glow-light">{name}</span>
        <span className="font-pt-sans text-sm">{title}</span>
    </a>
);

interface EventProfileProps {
    name: string;
    location: string;
    datetime: Date;
    description: string;
}

const EventProfile: FC<EventProfileProps> = ({ name, location, datetime, description }) => (
    <div className="rounded-3xl border-4 border-qa-blue p-5">
        <div className="mb-3 flex flex-row justify-between">
            <div>
                <span className="text-2xl">{name}</span>
                <div className="flex flex-row items-center gap-2">
                    <MdLocationPin />
                    <span className="font-pt-sans">{location}</span>
                </div>
            </div>

            <div className="flex flex-col items-end">
                <span className="font-pt-sans">{datetime.toLocaleDateString()}</span>
                <span className="font-pt-sans">{datetime.toLocaleTimeString(undefined, { timeStyle: 'short' }).toUpperCase()}</span>
            </div>
        </div>
        <p className="">{description}</p>
        <a href="/" className="text-qa-blue duration-200 hover:drop-shadow-qa-glow-intense">Learn more</a>
    </div>
);

interface SocialLinkProps {
    href: string;
    icon: IconType;
}

const SocialLink: FC<SocialLinkProps> = ({ href, icon: Icon }) => (
    <a href={href} target="_blank" rel="noreferrer" className="duration-200 hover:text-qa-blue">
        <Icon size={45} />
    </a>
);

export default function QAHome() {
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
            <section id="about" className="space-y-4">
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
                        <br />
                        <br />
                        We are a Barbershop Chorus located in Christchurch, New Zealand that perform a wide range of music blah lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed maximus semper lectus fa dfaf asdfasdf f adf asdfasdfasdf asdf asdf a dfasdf asdf asdfasdfringilla rhoncus.
                        In non mauris lorem. Nullam aliquam massa porta, suscipit urna a, fringilla sem. Quisque sed viverra massa. Nulla sed ipsum erat.
                        Donec maximus eget mauris nec elementum. Suspendisse pulvinar mi nisi, eget venenatis felis.
                    </p>
                    <div className="flex flex-col justify-between">
                        <Image src={qaWave} alt="picture" className="z-10 h-96 w-full rounded-3xl object-cover" />
                    </div>
                </div>
                <div className="flex w-full justify-center">
                    <div className="mb-1 mt-4 h-0.5 w-60 rounded-full bg-qa-white" />
                </div>
                <div className="flex w-full justify-center">
                    <div className="z-0 flex flex-row items-center justify-between gap-14">
                        <TeamProfile
                            image="/will.png"
                            name="Will Lynch"
                            title="Musical Director"
                        />
                        <TeamProfile
                            image="/harry.png"
                            name="Harry Burt"
                            title="Musical Director"
                        />
                        <TeamProfile
                            image="/nick.png"
                            name="Nick Davey"
                            title="Manager"
                        />
                        <TeamProfile
                            image="/nick.png"
                            name="Nick Davey"
                            title="Manager"
                        />
                    </div>
                </div>
            </section>
            <section id="upcoming" className="h-screen space-y-4">
                <span className="text-4xl font-semibold text-qa-blue">Upcoming Events</span>
                <div className="flex w-full flex-row gap-5">
                    <EventProfile
                        name="Open night"
                        location="3 Brake Street"
                        description="Banana flavoured ice cream is a disease. We would love for you to nullam aliquam massa porta, suscipit urna a, fringilla sem. Quisque sed viverra massa. Nulla sed ipsum erat. Donec maximus eget mauris nec elementum. Suspendisse pulvinar mi"
                        datetime={new Date()}
                    />
                    <EventProfile
                        name="Open night"
                        location="3 Brake Street"
                        description="Banana flavoured ice cream is a disease. We would love for you to nullam aliquam massa porta, suscipit urna a, fringilla sem. Quisque sed viverra massa. Nulla sed ipsum erat. Donec maximus eget mauris nec elementum. Suspendisse pulvinar mi"
                        datetime={new Date()}
                    />
                    <EventProfile
                        name="Open night"
                        location="3 Brake Street"
                        description="Banana flavoured ice cream is a disease. We would love for you to nullam aliquam massa porta, suscipit urna a, fringilla sem. Quisque sed viverra massa. Nulla sed ipsum erat. Donec maximus eget mauris nec elementum. Suspendisse pulvinar mi"
                        datetime={new Date()}
                    />
                </div>
            </section>
            <section id="media" className="h-screen" />
            <section id="join" className="h-screen" />
        </main>
    );
}
