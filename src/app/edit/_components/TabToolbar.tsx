import { Add } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

/** Responsive grid size used by every item card (people, events, quartets) */
export const ITEM_GRID_SIZE = { xs: 12, md: 6, lg: 4, xl: 3 };

interface TabToolbarProps {
    description: ReactNode;
    addLabel: string;
    onAdd: () => void;
    /** Extra buttons shown before the add button */
    actions?: ReactNode;
}

/**
 * Row shown at the top of a list tab explaining what is being edited, with a button to add a new item
 */
export default function TabToolbar({ description, addLabel, onAdd, actions }: TabToolbarProps) {
    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">{description}</Typography>
            <Stack direction="row" spacing={1} flexShrink={0}>
                {actions}
                <Button variant="contained" startIcon={<Add />} onClick={onAdd}>{addLabel}</Button>
            </Stack>
        </Stack>
    );
}
