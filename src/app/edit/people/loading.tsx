import { Add, Delete } from '@mui/icons-material';
import { Box, Button, Container, Grid2, IconButton, List, ListItem, Paper, Skeleton, Stack, TextField } from '@mui/material';
import { ChorusId } from '@prisma/client';

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
                    <List>
                        <ListItem sx={{ gap: 3 }}>
                            <Skeleton>
                                <TextField />
                            </Skeleton>
                            <Skeleton variant="circular">
                                <IconButton size="small"><Delete /></IconButton>
                            </Skeleton>
                        </ListItem>
                    </List>
                    <Box display="flex" gap={3}>
                        {Object.values(ChorusId).map((chorusId) => (
                            <Skeleton>
                                <Button
                                    key={chorusId}
                                    endIcon={<Add />}
                                >
                                    {chorusId}
                                </Button>
                            </Skeleton>
                        ))}
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Skeleton variant="circular" height={150} width={150} />
                    </Box>
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
