'use client';

import { useState, ReactNode } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface PastEventsSectionProps {
    children: ReactNode;
    titleClassName?: string;
}

export default function PastEventsSection({ children, titleClassName }: PastEventsSectionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section id="past-events" className="mt-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx('flex w-full items-center gap-4 transition-opacity duration-300 hover:opacity-70', titleClassName)}
                type="button"
            >
                <div className="h-px flex-1 bg-current opacity-50" />
                <div className="flex items-center gap-2">
                    <span className="text-base">Show Past Events</span>
                    {isOpen ? <FaChevronUp size="0.4em" /> : <FaChevronDown size="0.4em" />}
                </div>
                <div className="h-px flex-1 bg-current opacity-50" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="grid w-full grid-cols-1 gap-5 pt-4 lg:grid-cols-3">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
