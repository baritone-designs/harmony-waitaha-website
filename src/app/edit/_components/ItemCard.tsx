'use client';

import { Backdrop, Box, Button, CircularProgress, Paper, Stack } from '@mui/material';
import { useFormikContext } from 'formik';
import { PropsWithChildren, ReactNode } from 'react';

type ItemCardProps = PropsWithChildren<{
    /** Optional content shown above the fields, e.g. chips */
    header?: ReactNode;
} & ({
    isNew: true;
    onCancel: () => void;
} | {
    isNew?: false;
    /** Rendered next to the save buttons, usually a ConfirmButton */
    deleteButton?: ReactNode;
})>;

/**
 * Card wrapping a single editable item (person, event, quartet). Must be rendered inside a Formik form.
 *
 * Shows Save/Discard only once there are changes, and Create/Cancel for new items.
 */
export default function ItemCard({ header, children, ...props }: ItemCardProps) {
    const { dirty, isSubmitting, submitForm, resetForm } = useFormikContext();

    return (
        <Paper className="relative h-full" variant={props.isNew ? 'outlined' : 'elevation'} sx={props.isNew ? { borderColor: 'primary.main' } : undefined}>
            <Stack spacing={1} p={2} height="100%">
                {header}
                {children}
                <Box flexGrow={1} />
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {props.isNew ? (
                        <>
                            <Button onClick={props.onCancel}>Cancel</Button>
                            <Button variant="contained" onClick={submitForm}>Create</Button>
                        </>
                    ) : (
                        <>
                            {props.deleteButton}
                            <Box flexGrow={1} />
                            {dirty && <Button onClick={() => resetForm()}>Discard</Button>}
                            {dirty && <Button variant="contained" onClick={submitForm}>Save</Button>}
                        </>
                    )}
                </Stack>
            </Stack>
            <Backdrop sx={{ position: 'absolute', borderRadius: 'inherit' }} open={isSubmitting}>
                <CircularProgress />
            </Backdrop>
        </Paper>
    );
}
