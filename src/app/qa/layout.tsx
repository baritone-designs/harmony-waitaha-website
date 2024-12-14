import { FC, PropsWithChildren, ReactNode } from 'react';
import 'react-toastify/dist/ReactToastify.css';

const QaLayout: FC<PropsWithChildren<{
    person: ReactNode;
}>> = ({ person, children }) => (
    <main>
        {person}
        {children}
    </main>
);

export default QaLayout;
