import { Metadata } from 'next';
import Image from 'next/image';
import { ScrollImage } from './ScrollImage';
import PlainsmenHeader from './Header';
import plainsmenLogo from './plainsmen-logo.svg';
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
                    <Image src={plainsmenLogo} alt="plainsmen-logo" height={300} className="z-10" />
                </div>
                <div className="pointer-events-none absolute -inset-x-20 inset-y-0">
                    <ScrollImage />
                </div>
            </section>
            <section id="about" className="mt-52" />
            <section id="events" />
            <section id="join" />
        </main>
    );
}
