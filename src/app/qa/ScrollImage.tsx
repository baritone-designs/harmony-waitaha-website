'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef } from 'react';

export function ScrollImage() {
    const { scrollY } = useScroll();

    const ref = useRef<HTMLDivElement>(null);

    useMotionValueEvent(scrollY, 'change', (value) => {
        if (ref.current) {
            ref.current.style.backgroundPositionY = `${value * 0.4}px`;
        }
    });

    return (
        <motion.div
            id="home-image"
            className="absolute inset-0 -left-1/3 bg-[url('/qa-photo.png')] bg-cover opacity-40 lg:left-[30%] lg:opacity-100 lg:shadow-[inset_400px_200px_200px_#101c2a]"
            ref={ref}
        />
    );
}
