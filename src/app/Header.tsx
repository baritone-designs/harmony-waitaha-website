'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { m } from 'framer-motion';
import hwLogo from './hw-logo.svg';

interface HeaderLinkProps {
    url: string;
    children: string;
    active: boolean;
}

/**
 * Component for link in header of organisation layout.
 *
 * Handles underlining based upon current selected page
 */
const HeaderLink = ({ children, active, url }: HeaderLinkProps) => (
    <Link href={url} className="group relative flex h-10 cursor-pointer items-center gap-2 pb-1">
        <span
            className={clsx(active ? 'text-hw-blue' : 'text-hw-white', 'text-lg font-medium duration-200 group-hover:text-hw-blue group-hover:opacity-50')}
        >
            {children}
        </span>
    </Link>
);

export default function HWHeader() {
    const [active, setActive] = useState(0);
    const headerRef = useRef<HTMLHeadElement>(null);

    useEffect(() => {
        const scrollCallback = () => {
            const elements = document.querySelectorAll('section');
            const header = headerRef.current;

            if (!header) return;

            elements.forEach((section, i) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                const scrollPosition = window.scrollY + header.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    setActive(i);
                }
            });
        };

        scrollCallback();

        window.addEventListener('scroll', scrollCallback);

        return () => window.removeEventListener('scroll', scrollCallback);
    }, []);

    return (
        <header
            ref={headerRef}
            className="fixed left-0 z-10 flex h-[10vh] w-screen flex-row items-center justify-between bg-black/50 px-20 2xl:px-[12vw]"
        >
            <m.a href="#home" className="w-24" whileHover={{ scale: 1.05 }}>
                <Image
                    src={hwLogo}
                    alt="hw-logo"
                />
            </m.a>

            <nav className="flex flex-row gap-12">
                <HeaderLink url="#home" active={active === 0}>Home</HeaderLink>
                <HeaderLink url="#about" active={active === 1}>About</HeaderLink>
                <HeaderLink url="#choruses" active={active === 2}>Choruses</HeaderLink>
                <HeaderLink url="#quartets" active={active === 3}>Quartets</HeaderLink>
                <HeaderLink url="#events" active={active === 4}>Events</HeaderLink>
                <HeaderLink url="#contact" active={active === 4}>Contact</HeaderLink>
            </nav>

            <div className="w-24" />
        </header>
    );
}
