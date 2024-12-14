import { Box, Container, Grid2, Paper, Skeleton, Stack, TextField } from '@mui/material';

function CardSkeleton() {
    return (
        <Grid2 size={3}>
            <Paper className="relative">
                <Stack spacing={1} p={2}>
                    <Skeleton width="100%">
                        <TextField />
                    </Skeleton>
                    <Skeleton width="100%">
                        <TextField />
                    </Skeleton>
                    <Skeleton width="100%">
                        <TextField />
                    </Skeleton>
                    <Skeleton width="100%">
                        <TextField />
                    </Skeleton>
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 self-stretch">
                        <Skeleton>
                            <TextField />
                        </Skeleton>
                        <Skeleton>
                            <TextField />
                        </Skeleton>
                        <Skeleton>
                            <TextField />
                        </Skeleton>
                        <Skeleton>
                            <TextField />
                        </Skeleton>
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 self-stretch">
                        <Skeleton>
                            <TextField />
                        </Skeleton>
                        <Skeleton>
                            <TextField />
                        </Skeleton>
                        <Skeleton>
                            <TextField />
                        </Skeleton>
                        <Skeleton>
                            <TextField />
                        </Skeleton>
                    </div>
                    <Box display="flex" justifyContent="center">
                        <Skeleton variant="circular" height={150} width={150} />
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Skeleton variant="rounded" height={200} width={300} />
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Skeleton variant="rounded" height={200} width={300} />
                    </Box>
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
