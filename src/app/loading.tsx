'use client';

import CircularProgress from '@mui/material/CircularProgress';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

interface Props {
    className?: string;
    color1?: string;
    color2?: string;
}

function LoadingPage({ className, color1, color2 }: Props) {
    return (
        <main className={clsx(className, 'absolute inset-0')}>
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="loading-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color1} />
                        <stop offset="100%" stopColor={color2 ?? color1} />
                    </linearGradient>
                </defs>
            </svg>
            <CircularProgress sx={color1 ? { 'svg circle': { stroke: 'url(#loading-gradient)' } } : undefined} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </main>
    );
}

export default function Loading() {
    const pathName = usePathname();

    if (pathName?.startsWith('/qa')) {
        return (
            <LoadingPage className="bg-qa-blue-darker" color1="#18C0DE" />
        );
    }

    if (pathName?.startsWith('/plainsmen')) {
        return (
            <LoadingPage className="bg-hw-black" color1="#8DA7D6" color2="#DD0000" />
        );
    }

    if (pathName?.startsWith('/edit')) {
        return (
            <LoadingPage />
        );
    }

    return (
        <LoadingPage className="bg-hw-white" color1="#1BC0DD" color2="#DA1F26" />
    );
}
