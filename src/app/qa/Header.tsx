'use client';

import Image from 'next/image';
import qaLogo from '@/assets/images/qa-logo.png';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

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
        <span className={clsx(active && 'text-blue-qa drop-shadow-glow-intense', 'text-lg font-extrabold duration-200 group-hover:text-blue-qa group-hover:opacity-50')}>{children}</span>

        {active && (
            <motion.div
                layoutId="header-link-underline"
                className={clsx(active && 'opacity-100', 'absolute inset-x-0 bottom-1 h-0.5 rounded-full bg-blue-qa opacity-0')}
            />
        )}
    </Link>
);

export default function QAHeader() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const scrollCallback = () => {
            const elements = document.querySelectorAll('section');

            elements.forEach((section, i) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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
            className="fixed left-0 z-10 flex w-screen flex-row items-center justify-between px-9 pb-4 pt-7"
        >
            <a href="#home" className="w-12">
                <Image
                    src={qaLogo}
                    alt="qa-logo"
                    height={60}
                    width={60}
                />
            </a>

            <nav className="flex flex-row gap-12">
                <HeaderLink url="#home" active={active === 0}>Home</HeaderLink>
                <HeaderLink url="#about" active={active === 1}>About</HeaderLink>
                <HeaderLink url="#upcoming" active={active === 2}>Upcoming</HeaderLink>
                <HeaderLink url="#media" active={active === 3}>Media</HeaderLink>
                <HeaderLink url="#follow" active={active === 4}>Follow</HeaderLink>
            </nav>

            <div className="w-12" />
        </header>
    );
}
