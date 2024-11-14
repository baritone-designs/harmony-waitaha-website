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
        <motion.div id="home-image" className="invisible lg:visible" ref={ref} />
    );
}
