import { Metadata } from 'next';
import Image from 'next/image';
import { CustomCarousel } from '@/components/Carousel';
import { ScrollImage } from './ScrollImage';
import PlainsmenHeader from './Header';
import './index.css';

export const metadata: Metadata = {
    title: 'The Plainsmen',
    description: 'Barbershop mens chorus from Christchurch, New Zealand',
};

export default function PlainsmenHome() {
    return (
        <main className="px-20 2xl:px-[10vw]">
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
                        <CustomCarousel />
                    </div>
                </div>
                <div className="flex w-full justify-center">
                    <div className="mb-1 mt-4 h-0.5 w-60 rounded-full bg-qa-white" />
                </div>
                <div className="flex w-full justify-center">
                    <div className="z-0 flex flex-row items-center justify-between gap-14">
                        aaa
                    </div>
                </div>
            </section>

            <section id="events" />
            <section id="join" />
        </main>
    );
}
