import { Container, Grid, Stack } from '@mui/material';
import EmailWhitelist from './EmailWhitelist';
import EditChoruses from './EditChoruses';

export default function EditRoot() {
    return (
        <Container sx={{ marginY: 5 }} maxWidth="xl">
            <Stack spacing={2}>
                <Grid container spacing={2}>
                    <EmailWhitelist />
                </Grid>
                <EditChoruses />
            </Stack>
        </Container>
    );
}
