import { ScrollImage } from '@/app/qa/ScrollImage';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { IoChevronDown } from 'react-icons/io5';
import { MotionA } from '@/components/Motion';
import Image from 'next/image';
import qaWave from '@/assets/images/qa-wave.png';

import { FC } from 'react';
import { IconType } from 'react-icons';
import { Metadata } from 'next';
import QAHeader from './Header';

import './index.css';

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
    <a href="/" className="group flex flex-col items-center rounded-xl border-2 border-transparent p-3 duration-200 hover:scale-105 hover:bg-qa-blue-dark hover:shadow-lg">
        <div className="h-52 w-52 rounded-full bg-contain bg-center duration-200" style={{ backgroundImage: `url('${image}')` }} />
        <span className="mt-5 text-xl font-medium duration-200 group-hover:text-qa-blue group-hover:drop-shadow-qa-glow-light">{name}</span>
        <span>{title}</span>
    </a>
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
        <main className="px-20">
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
                <div className="pointer-events-none absolute -inset-x-20 inset-y-0 z-0">
                    <ScrollImage />
                </div>
                <MotionA
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.8, ease: 'easeIn' }}
                    animate={{ transform: ['translate(-50%, 0)', 'translate(-50%, 20px)'] }}
                    className="absolute bottom-10 left-1/2"
                    href="#about"
                >
                    <IoChevronDown size={45} className="text-white duration-200 hover:text-qa-blue" />
                </MotionA>
            </section>
            <section id="about" className="space-y-4">
                <span className="text-5xl font-semibold text-qa-blue">About Us</span>
                <div className="grid grid-cols-2 gap-20">
                    <p className="text-2xl">
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
                        <Image src={qaWave} alt="picture" />
                        <span className="z-10 mt-8 text-5xl font-semibold text-qa-blue">Our People</span>
                        <div className="z-0 flex flex-row justify-between">
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
                        </div>
                    </div>
                </div>
            </section>
            <section id="upcoming" className="h-screen" />
            <section id="media" className="h-screen" />
            <section id="join" className="h-screen" />
        </main>
    );
}
