import { Container } from '@mui/material';
import EmailWhitelist from './EmailWhitelist';

export default function EditAccessPage() {
    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <EmailWhitelist />
        </Container>
    );
}
