'use client';

import { FC, PropsWithChildren } from 'react';
import { trpc } from '@/common/trpc';
import { LazyMotion, domMax } from 'framer-motion';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
    session: Session;
}

const Providers: FC<PropsWithChildren<ProvidersProps>> = ({ session, children }) => (
    <SessionProvider session={session}>
        <LazyMotion features={domMax}>
            {children}
        </LazyMotion>
    </SessionProvider>
);

export default trpc.react.withTRPC(Providers) as FC<PropsWithChildren<ProvidersProps>>;
