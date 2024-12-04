import { Metadata } from 'next';
import { FC, PropsWithChildren, ReactNode } from 'react';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
    title: 'Quantum Acoustics',
    description: 'Youth Barbershop Harmony chorus in Christchurch New Zealand',
};

const QaLayout: FC<PropsWithChildren<{
    person: ReactNode;
}>> = ({ person, children }) => (
    <section>
        {person}
        {children}
    </section>
);

export default QaLayout;
