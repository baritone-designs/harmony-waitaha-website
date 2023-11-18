'use client';

import Image from 'next/image';
import qaLogo from '@/assets/images/qa-logo.png';
import { trpc } from '@/common/trpc';

export default function Home() {
    const { data } = trpc.react.hello.useQuery();

    return (
        <body
            id="body"
            className="h-full animate-fade_in overflow-x-hidden bg-gradient-to-br from-blue-lighter to-blue-darker px-9 md:px-16 xl:px-[10vw]"
        >
            <header
                id="header"
                className="fixed left-0 z-10 flex w-screen flex-row items-center justify-between px-9 pb-4 pt-7 md:px-16 xl:px-[10vw]"
            >
                <a href="#home">
                    <Image
                        src={qaLogo}
                        alt="qa-logo"
                        height={100}
                        width={100}
                        className="h-12 rounded-full md:h-14"
                    />
                </a>
                {data}
            </header>
        </body>
    );
}
