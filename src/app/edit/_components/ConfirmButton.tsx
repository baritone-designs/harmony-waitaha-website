'use client';

import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ReactNode, useState } from 'react';

interface ConfirmButtonProps extends Omit<ButtonProps, 'onClick'> {
    title: string;
    message: ReactNode;
    confirmLabel: string;
    onConfirm: () => void | Promise<void>;
}

/**
 * Button which asks the user to confirm before running a destructive action
 */
export default function ConfirmButton({ title, message, confirmLabel, onConfirm, ...buttonProps }: ConfirmButtonProps) {
    const [open, setOpen] = useState(false);
    const [running, setRunning] = useState(false);

    const handleConfirm = async () => {
        setRunning(true);

        try {
            await onConfirm();
            setOpen(false);
        } finally {
            setRunning(false);
        }
    };

    return (
        <>
            <Button {...buttonProps} onClick={() => setOpen(true)} />
            <Dialog open={open} onClose={() => !running && setOpen(false)}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={running}>Cancel</Button>
                    <Button onClick={handleConfirm} color="error" variant="contained" loading={running}>
                        {confirmLabel}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
