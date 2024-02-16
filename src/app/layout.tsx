import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';

import './gothic-font.css';
import './globals.css';

export const metadata: Metadata = {
    title: 'Harmony Waitaha',
    description: 'Barbershop Harmony organisation in Christchurch New Zealand',
};

const productSans = localFont({
    src: '../assets/fonts/ProductSans.ttf',
    variable: '--font-pt-sans',
});

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-poppins',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: {
  children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${productSans.variable} ${poppins.variable}`}>
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
