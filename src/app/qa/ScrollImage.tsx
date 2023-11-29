'use client';

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ScrollImage() {
    const { scrollYProgress } = useScroll();

    const ref = useRef<HTMLDivElement>(null);

    useMotionValueEvent(scrollYProgress, 'change', (value) => {
        ref.current.style.backgroundPositionY = `${value * 2000}px`;
    });

    return (
        <motion.div id="home-image" ref={ref} />
    );
}
