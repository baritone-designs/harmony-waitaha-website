'use client';

import { FC, PropsWithChildren } from 'react';
import { trpc } from '@/common/trpc';
import { LazyMotion, domMax } from 'framer-motion';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import GoogleProvider from '@/providers/GoogleProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material';
import { darkTheme } from './materialTheme';

interface ProvidersProps {
    session: Session;
}

const Providers: FC<PropsWithChildren<ProvidersProps>> = ({ session, children }) => (
    <AppRouterCacheProvider>
        <ThemeProvider theme={darkTheme}>
            <GoogleProvider>
                <SessionProvider session={session}>
                    <LazyMotion features={domMax}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {children}
                        </LocalizationProvider>
                    </LazyMotion>
                </SessionProvider>
            </GoogleProvider>
        </ThemeProvider>
    </AppRouterCacheProvider>
);

export default trpc.react.withTRPC(Providers) as FC<PropsWithChildren<ProvidersProps>>;
