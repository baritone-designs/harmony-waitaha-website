import { CheckBox } from '@mui/icons-material';
import { Container, FormControlLabel, Grid2, Paper, Skeleton, Stack, TextField } from '@mui/material';
import { ChorusId } from '@prisma/client';

function CardSkeleton() {
    return (
        <Grid2 size={3}>
            <Paper className="relative">
                <Stack spacing={1} p={2}>
                    <Skeleton width="100%">
                        <TextField variant="standard" />
                    </Skeleton>
                    <Skeleton width="100%">
                        <TextField variant="standard" />
                    </Skeleton>
                    <Skeleton width="100%">
                        <TextField variant="outlined" />
                    </Skeleton>
                    <Skeleton width="100%">
                        <TextField variant="outlined" />
                    </Skeleton>
                    {Object.keys(ChorusId).map((id) => (
                        <Skeleton>
                            <FormControlLabel label={id} control={<CheckBox />} />
                        </Skeleton>
                    ))}
                    <Skeleton width="100%" height={50} />
                </Stack>
            </Paper>
        </Grid2>
    );
}

export default function Loading() {
    return (
        <Container sx={{ marginY: 5 }} maxWidth="xl">
            <Grid2 container spacing={2}>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </Grid2>
        </Container>
    );
}
