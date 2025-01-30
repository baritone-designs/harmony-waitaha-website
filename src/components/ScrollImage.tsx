'use client';

import clsx from 'clsx';
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';

interface ScrollImageProps {
    url: string;
    className?: string;
}

export default function ScrollImage({ url, className }: ScrollImageProps) {
    const { scrollY } = useScroll();

    const offset = useTransform(() => scrollY.get() * 0.4);

    const transform = useMotionTemplate`translateY(${offset}px)`;

    return (
        <div className="relative size-full overflow-hidden">
            <motion.div
                className={clsx('absolute inset-0 bg-cover', className)}
                style={{
                    transform,
                    backgroundImage: `url('${url}')`,
                }}
            />
        </div>
    );
}
