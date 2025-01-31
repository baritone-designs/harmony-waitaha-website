import { FC, PropsWithChildren } from 'react';
import 'react-toastify/dist/ReactToastify.css';

const PlainsmenLayout: FC<PropsWithChildren> = ({ children }) => (
    <main>
        {children}
    </main>
);

export default PlainsmenLayout;
