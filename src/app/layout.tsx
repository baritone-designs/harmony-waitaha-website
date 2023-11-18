import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import localFont from 'next/font/local';

export const metadata: Metadata = {
    title: 'Harmony Waitaha',
    description: 'Barbershop Harmony organisation in Christchurch New Zealand',
};

const allRoundGothic = localFont({
    src: '../assets/fonts/AllRoundGothic.ttf',
    variable: '--font-ar-gothic',
});

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
        <html lang="en" className={`${allRoundGothic.className} ${productSans.className}`}>
            <Providers>
                {children}
            </Providers>
        </html>
    );
}
