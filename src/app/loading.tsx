'use client';

import { CircularProgress } from '@mui/material';

export default function Loading() {
    return (
        <CircularProgress className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
    );
}
