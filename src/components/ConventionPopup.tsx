'use client';

import clsx from 'clsx';
import { m, AnimatePresence } from 'framer-motion';
import { Close } from '@mui/icons-material';
import { useCookie } from 'react-use';
import ModalBackdrop from './ModalBackdrop';

export default function ConventionPopup() {
    const [open, setOpen] = useCookie('convention-popup');

    if (new Date() >= new Date('2025-09-22')) {
        return null;
    }

    if (open === null) {
        setOpen('true');
    }

    return (
        <>
            <button className="fixed left-0 top-1/2 z-10 -translate-y-1/2 rounded-r-3xl bg-hw-white p-5 shadow-lg duration-200 hover:px-7" type="button" onClick={() => setOpen('true')}>
                <span className="text-3xl" style={{ writingMode: 'vertical-rl' }}>Convention</span>
            </button>
            <AnimatePresence>
                {open === 'true' && (
                    <ModalBackdrop onClose={() => setOpen('false')}>
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                borderRadius: '24px',
                            }}
                            className={clsx(
                                'absolute left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 overflow-hidden bg-hw-white p-10 text-center',
                            )}
                        >
                            <img src="/convention-logo.png" alt="convention-logo" className="hidden lg:block" />
                            <span className="text-5xl">Welcome to <b>He Awa Whiria</b>!</span>
                            <span className="text-4xl">BHNZ 2025 Convention</span>
                            <span className="text-3xl">Hosted by Harmony Waitaha</span>
                            <span>19 - 21 September 2025 | James Hay Theatre, 86 Kilmore Street, Christchurch</span>
                            <button onClick={() => setOpen('false')} type="button">
                                <Close className="absolute right-5 top-5 text-hw-black duration-200 hover:opacity-75" />
                            </button>
                            <span className="mt-10 text-xl">Important Links:</span>
                            <div className="flex flex-row gap-5 text-xl text-hw-black underline">
                                <a target="_blank" href="https://convention.barbershopharmony.nz/" rel="noreferrer">Convention Website</a>
                                <a target="_blank" href="https://convention.barbershopharmony.nz/files/He%20Awa%20Whira%202025%20Programme%20(15).pdf" rel="noreferrer">Programme</a>
                                <a target="_blank" href="https://whosup.live/bhnz25" rel="noreferrer">Whosup</a>
                            </div>
                            <span className="text-xl">Live Streams:</span>
                            <div className="flex flex-row gap-5 text-xl text-hw-black underline">
                                <a target="_blank" href="https://www.youtube.com/watch?v=WHkCray69Ek" rel="noreferrer">Quartet Semifinals</a>
                                <a target="_blank" href="https://www.youtube.com/watch?v=RtsK8befXEA" rel="noreferrer">Quartet Finals</a>
                                <a target="_blank" href="https://www.youtube.com/watch?v=z3Q-huhLFLc" rel="noreferrer">Chorus Finals</a>
                            </div>
                        </m.div>
                    </ModalBackdrop>
                )}
            </AnimatePresence>
        </>
    );
}
