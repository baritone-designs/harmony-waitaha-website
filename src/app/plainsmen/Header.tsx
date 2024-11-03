'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { m, motion } from 'framer-motion';
import qaLogo from './icon.svg';
import './index.css';

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
    <Link href={url} className="relative flex h-8 cursor-pointer items-center gap-2 pb-1 duration-200 hover:opacity-50">
        <span className={clsx(active && 'text-pm-red', 'text-lg font-semibold')}>{children}</span>

        {active && (
            <motion.div
                layoutId="header-link-underline"
                className="absolute inset-x-0 bottom-1 h-0.5 rounded-full bg-pm-red"
            />
        )}
    </Link>
);

export default function PlainsmenHeader() {
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
            // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
            className="fixed left-0 z-50 flex h-[10vh] w-screen flex-row items-center justify-between overflow-hidden bg-black bg-opacity-30 px-20"
        >
            <m.a href="#home" className="w-12" whileHover={{ scale: 1.05 }}>
                <Image
                    src={qaLogo}
                    alt="qa-logo"
                    height={60}
                    width={60}
                />
            </m.a>

            <nav className="flex flex-row gap-12">
                <HeaderLink url="#home" active={active === 0}>Home</HeaderLink>
                <HeaderLink url="#about" active={active === 1}>About</HeaderLink>
                <HeaderLink url="#upcoming" active={active === 2}>Events</HeaderLink>
                {/* <HeaderLink url="#media" active={active === 3}>Media</HeaderLink> */}
                <HeaderLink url="#join" active={active === 4}>Join</HeaderLink>
            </nav>

            <div className="w-12" />
        </header>
    );
}
