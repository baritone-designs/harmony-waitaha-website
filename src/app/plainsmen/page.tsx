import { Metadata } from 'next';
import Image from 'next/image';
import { CustomCarousel } from '@/components/Carousel';
// import { FC } from 'react';
import Link from 'next/link';
import { ChorusId, Person } from '@prisma/client';
import { prisma } from '@/common/prisma';
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
        <div className="h-40 w-40 rounded-3xl bg-cover bg-center duration-200" style={{ backgroundImage: `url('${iconUrl}')` }} />
        <span className="mt-5 text-lg font-medium duration-200">{name}</span>
        <span className="font-pt-sans text-sm">{role}</span>
    </Link>
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
                        {people.map((person) => (
                            <TeamProfile key={person.id} {...person} />
                        ))}
                    </div>
                </div>
            </section>

            <section id="events" />
            <section id="join" />
        </main>
    );
}
