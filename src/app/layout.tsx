import { Metadata } from 'next';
import Providers from '@/components/Providers';
import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import { FC, PropsWithChildren } from 'react';

import './gothic-font.css';
import './globals.css';
import 'react-datetime/css/react-datetime.css';

export const metadata: Metadata = {
    title: 'Harmony Waitaha',
    description: 'Barbershop Harmony organisation in Christchurch New Zealand',
};

const productSans = localFont({
    src: '../assets/fonts/ProductSans.ttf',
    variable: '--font-pt-sans',
});

const harmony = localFont({
    src: '../assets/fonts/harmony.ttf',
    variable: '--font-harmony',
});

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-poppins',
    subsets: ['latin'],
});

const RootLayout: FC<PropsWithChildren<{
    // This just has to be `never` so nextjs builds properly...
    session: never;
}>> = ({ session, children }) => (
    <html lang="en" className={`${productSans.variable} ${poppins.variable} ${harmony.variable}`}>
        <body>
            <Providers session={session}>
                {children}
            </Providers>
        </body>
    </html>
);

export default RootLayout;
