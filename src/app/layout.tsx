import { Metadata } from 'next';
import Providers from '@/components/Providers';
import localFont from 'next/font/local';
import { Inter, Poppins } from 'next/font/google';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

import './gothic-font.css';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { CssBaseline } from '@mui/material';

export const metadata: Metadata = {
    title: 'Harmony Waitaha',
    description: 'Barbershop Harmony organisation in Christchurch New Zealand',
};

const productSans = localFont({
    src: '../assets/fonts/ProductSans.ttf',
    variable: '--font-pt-sans',
});

const inter = Inter({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
});

const harmony = localFont({
    src: '../assets/fonts/harmony.ttf',
    variable: '--font-harmony',
});

const centuryGothic = localFont({
    src: '../assets/fonts/century-gothic.otf',
    variable: '--font-century-gothic',
});

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-poppins',
    subsets: ['latin'],
});

const RootLayout: FC<PropsWithChildren<{
    // This just has to be `never` so nextjs builds properly...
    session: never;
    quartet: ReactNode;
}>> = ({ session, quartet, children }) => (
    <html lang="en" className={`${productSans.variable} ${poppins.variable} ${harmony.variable} ${centuryGothic.variable} ${inter.className}`}>
        <body>
            <Providers session={session}>
                <CssBaseline />
                {quartet}
                {children}
                <ToastContainer autoClose={2000} theme="dark" position="bottom-center" />
            </Providers>
        </body>
    </html>
);

export default RootLayout;
