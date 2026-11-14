import { Grid, Paper, Skeleton, Stack } from '@mui/material';
import { ITEM_GRID_SIZE } from './TabToolbar';

export function CardGridSkeleton() {
    return (
        <Stack spacing={2}>
            <Skeleton variant="rounded" height={40} />
            <Grid container spacing={2}>
                {[0, 1, 2, 3].map((i) => (
                    <Grid key={i} size={ITEM_GRID_SIZE}>
                        <Paper>
                            <Stack spacing={2} p={2}>
                                <Skeleton variant="rounded" height={40} />
                                <Skeleton variant="rounded" height={80} />
                                <Skeleton variant="circular" height={120} width={120} sx={{ alignSelf: 'center' }} />
                                <Skeleton variant="rounded" height={36} />
                            </Stack>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}

export function PageFormSkeleton() {
    return (
        <Stack spacing={2}>
            {[0, 1, 2].map((i) => (
                <Paper key={i}>
                    <Stack spacing={2} p={2}>
                        <Skeleton width={200} />
                        <Skeleton variant="rounded" height={40} />
                        <Skeleton variant="rounded" height={40} />
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );
}
