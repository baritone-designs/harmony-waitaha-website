import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import localFont from 'next/font/local';

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

export default function RootLayout({
    children,
}: {
  children: React.ReactNode;
}) {
    return (
        <html lang="en" className={productSans.variable}>
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
