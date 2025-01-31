'use client';

import { PropsWithChildren } from 'react';
import { m } from 'framer-motion';

export default function ModalBackdrop({ onClose, children }: PropsWithChildren<{ onClose: () => void }>) {
    return (
        <m.div
            initial={{ backdropFilter: 'blur(12px) opacity(0)', backgroundColor: 'rgb(0 0 0 / 0)' }}
            animate={{ backdropFilter: 'blur(8px) opacity(1)', backgroundColor: 'rgb(0 0 0 / 0.5)' }}
            exit={{ backdropFilter: 'blur(12px) opacity(0)', backgroundColor: 'rgb(0 0 0 / 0)' }}
            className="fixed inset-0 z-40"
        >
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0"
            />
            {children}
        </m.div>
    );
}
