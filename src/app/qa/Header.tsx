'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { m, motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from 'react-use';
import { Squash as Hamburger } from 'hamburger-react';

interface HeaderLinkProps {
    url: string;
    children: string;
    active: boolean;
}

const routes = [
    {
        title: 'Home',
        href: '#home',
        checkActive: 0,
    },
    {
        title: 'About',
        href: '#about',
        checkActive: 1,
    },
    {
        title: 'Events',
        href: '#events',
        checkActive: 2,
    },
    {
        title: 'Join',
        href: '#join',
        checkActive: 5,
    },
];

const HeaderLink = ({ children, active, url }: HeaderLinkProps) => (
    <Link href={url} className="relative flex h-10 cursor-pointer items-center gap-2 pb-1">
        <span className={clsx(
            active && 'text-qa-blue drop-shadow-qa-glow-intense duration-200',
            'text-lg font-medium duration-200 hover:text-qa-blue hover:drop-shadow-qa-glow-intense',
        )}
        >{children}
        </span>

        {active && (
            <motion.div
                layoutId="header-link-underline"
                className="absolute inset-x-0 bottom-1 h-0.5 rounded-full bg-qa-blue drop-shadow-qa-glow-intense"
            />
        )}
    </Link>
);

const NavMobile = () => {
    const [isOpen, setOpen] = useState(false);
    const ref = useRef(null);

    useClickAway(ref, () => setOpen(false));

    return (
        <div ref={ref} className="flex justify-end lg:hidden">
            <Hamburger toggled={isOpen} size={20} toggle={setOpen} />
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-0 w-1/2 p-5"
                    >
                        <ul className="grid gap-2">
                            {routes.map((route, idx) => {
                                const { href, title } = route;

                                return (
                                    <motion.li
                                        initial={{ x: -500 }}
                                        animate={{ x: 0 }}
                                        transition={{
                                            ease: 'easeOut',
                                            duration: 0.4,
                                            delay: 0.1 + idx / 20,
                                        }}
                                        key={route.title}
                                        className="rounded-xl p-0.5"
                                    >
                                        <a
                                            onClick={() => setOpen((prev) => !prev)}
                                            className="flex w-fit items-center justify-between rounded-full bg-hw-black p-3"
                                            href={href}
                                        >
                                            <span className="flex gap-1 text-white">{title}</span>
                                        </a>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function QAHeader() {
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
            className="fixed z-50 flex w-full justify-center bg-gradient-to-b from-qa-blue-darker from-5% to-transparent lg:h-32"
            ref={headerRef}
        >
            <div
                className="invisible flex h-full w-full max-w-screen-2xl flex-row items-center justify-between px-5 lg:visible lg:px-20 2xl:px-24"
            >
                <m.a href="#home" className="w-24" whileHover={{ opacity: 0.5 }}>
                    <Image
                        src="/qa/icon.svg"
                        alt="qa-logo"
                        width={50}
                        height={50}
                    />
                </m.a>

                <nav className="hidden flex-row gap-12 lg:flex">
                    {routes.map((route) => {
                        const { href, title, checkActive } = route;
                        return (
                            <HeaderLink url={href} active={active === checkActive}>{title}</HeaderLink>
                        );
                    })}
                </nav>

                <div className="w-24" />
            </div>
            <div className="visible mr-5 mt-5 flex items-center justify-end rounded-full bg-black/50 p-1 lg:invisible">
                <NavMobile />
            </div>
        </header>
    );
}
