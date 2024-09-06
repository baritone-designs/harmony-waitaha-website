'use client';

/**
 * This file imports framer motion in a client file so it doesent crash, and then exports in a way that server components can use
 */

import { AnimatePresence, m } from 'framer-motion';

export const MotionDiv = m.div;
export const MotionA = m.a;
export const ServerAnimatePresence = AnimatePresence;
