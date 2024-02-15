import { ScrollImage } from '@/app/qa/ScrollImage';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { IoChevronDown } from 'react-icons/io5';
import { MotionA, MotionDiv } from '@/components/Motion';
import Image from 'next/image';
import qaWave from '@/assets/images/qa-wave.png';

import { FC } from 'react';
import Link from 'next/link';
import QAHeader from './Header';

interface TeamProfileProps {
    image: string;
    name: string;
    title: string;
}

const TeamProfile: FC<TeamProfileProps> = ({ image, name, title }) => (
    <Link href="/" className="group flex flex-col items-center rounded-xl border-2 border-transparent p-3 duration-200 hover:scale-105 hover:bg-blue-dark hover:shadow-lg">
        <div className="h-52 w-52 rounded-full bg-center duration-200" style={{ backgroundImage: `url('${image}')` }} />
        <span className="mt-5 text-xl font-medium duration-200 group-hover:text-blue-qa group-hover:drop-shadow-glow-light">{name}</span>
        <span>{title}</span>
    </Link>
);

export default function QAHome() {
    return (
        <main className="px-20">
            <QAHeader />
            <section id="home" className="relative flex h-screen flex-col justify-center overflow-x-hidden">
                <div className="flex flex-col text-7xl font-medium">
                    <span>
                        <span className="text-blue-qa drop-shadow-glow-light">Q</span>
                        <span>uantum</span>
                    </span>
                    <span>
                        <span className="text-blue-qa drop-shadow-glow-light">A</span>
                        <span>coustics</span>
                    </span>
                    <div className="mt-5 flex gap-5 text-white">
                        <a href="https://www.instagram.com/qachorus" target="_blank" rel="noreferrer" className="duration-200 hover:text-blue-qa">
                            <FaInstagram size={40} />
                        </a>
                        <a href="https://www.tiktok.com/@qachorus" target="_blank" rel="noreferrer" className="duration-200 hover:text-blue-qa">
                            <FaTiktok size={40} className="duration-200 hover:text-blue-qa" />
                        </a>
                        <a href="https://www.facebook.com/qachorus/" target="_blank" rel="noreferrer" className="duration-200 hover:text-blue-qa">
                            <FaFacebook size={40} className="duration-200 hover:text-blue-qa" />
                        </a>
                    </div>
                </div>
                <ScrollImage />
                <MotionA
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.8, ease: 'easeIn' }}
                    animate={{ transform: ['translate(-50%, 0)', 'translate(-50%, 5px)'] }}
                    className="absolute bottom-10 left-1/2"
                    href="#about"
                >
                    <IoChevronDown size={50} className="text-white duration-200 hover:text-blue-qa" />
                </MotionA>
            </section>
            <section id="about" className="space-y-4">
                <span className="text-4xl font-medium text-blue-qa">About Us</span>
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
                        <span className="text-4xl font-medium text-blue-qa">Our People</span>
                        <div className="flex flex-row justify-between">
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
