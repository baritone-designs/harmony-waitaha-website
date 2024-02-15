'use client';

import { FC, PropsWithChildren } from 'react';
import { trpc } from '@/common/trpc';
import { LazyMotion, domMax } from 'framer-motion';

const Providers: FC<PropsWithChildren> = ({ children }) => (
    <LazyMotion features={domMax}>
        {children}
    </LazyMotion>
);

export default trpc.react.withTRPC(Providers) as FC<PropsWithChildren>;
