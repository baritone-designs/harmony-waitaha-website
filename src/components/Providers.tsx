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
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { darkTheme } from './materialTheme';

dayjs.extend(utc);
dayjs.extend(timezone);

interface ProvidersProps {
    session: Session;
}

const Providers: FC<PropsWithChildren<ProvidersProps>> = ({ session, children }) => (
    <AppRouterCacheProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={darkTheme}>
                <GoogleProvider>
                    <SessionProvider session={session}>
                        <LazyMotion features={domMax}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Analytics />
                                <SpeedInsights />
                                {children}
                            </LocalizationProvider>
                        </LazyMotion>
                    </SessionProvider>
                </GoogleProvider>
            </ThemeProvider>
        </LocalizationProvider>
    </AppRouterCacheProvider>
);

export default trpc.react.withTRPC(Providers) as FC<PropsWithChildren<ProvidersProps>>;
