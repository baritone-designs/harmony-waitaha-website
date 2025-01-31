import { FC, PropsWithChildren } from 'react';
import 'react-toastify/dist/ReactToastify.css';

const QaLayout: FC<PropsWithChildren> = ({ children }) => (
    <main>
        {children}
    </main>
);

export default QaLayout;
