'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { m, AnimatePresence, motion } from 'framer-motion';
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
        title: 'Choruses',
        href: '#choruses',
        checkActive: 2,
    },
    {
        title: 'Quartets',
        href: '#quartets',
        checkActive: 3,
    },
    {
        title: 'Events',
        href: '#events',
        checkActive: 4,
    },
    {
        title: 'Contact',
        href: '#contact',
        checkActive: 5,
    },
];

const HeaderLink = ({ children, active, url }: HeaderLinkProps) => (
    <Link href={url} className="group relative flex h-10 cursor-pointer items-center gap-2 pb-1">
        <span
            className={clsx(active ? 'text-hw-blue' : 'text-hw-white', 'text-lg font-medium duration-200 group-hover:text-hw-blue group-hover:opacity-50')}
        >
            {children}
        </span>
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

export default function HWHeader({ logoUrl }: { logoUrl: string | null}) {
    const [active, setActive] = useState(0);
    const headerRef = useRef<HTMLHeadElement>(null);

    useEffect(() => {
        const scrollCallback = () => {
            const elements = document.querySelectorAll('section');
            const header = headerRef.current;

            if (!header) return;

            elements.forEach((section, i) => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight - 100;

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
        <header className="fixed z-20 flex w-full justify-center lg:h-20 lg:bg-black/50" ref={headerRef}>
            <div
                className="invisible flex size-full max-w-screen-2xl flex-row items-center justify-between px-5 lg:visible lg:px-20 2xl:px-24"
            >
                <m.a href="#home" className="w-24" whileHover={{ scale: 1.05 }}>
                    {logoUrl && (
                        <Image
                            src={logoUrl}
                            alt="hw-logo"
                            width={100}
                            height={100}
                        />
                    )}
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
