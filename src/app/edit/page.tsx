'use client';

import { trpc } from '@/common/trpc';
import { formikProps } from '@/components/formikUtils';
import { protectedClientPage } from '@/components/protectedClientPage';
import { Container, Grid2, IconButton, Paper, Skeleton, Stack, TextField } from '@mui/material';
import { Formik } from 'formik';
import { useCallback } from 'react';
import { FaPlusCircle, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const EmailWhitelist = protectedClientPage(({ user }) => {
    const { data: databaseEmails, isError, isLoading: databaseEmailsLoading, refetch } = trpc.react.auth.getDatabaseWhitelistedEmails.useQuery();
    const { data: environmentEmails, isLoading: environmentEmailsLoading } = trpc.react.auth.getEnvironmentWhitelistedEmails.useQuery();

    const { mutateAsync: deleteEmail } = trpc.react.auth.unWhitelistEmail.useMutation();
    const { mutateAsync: addEmail } = trpc.react.auth.whitelistEmail.useMutation();

    const handleDeleteEmail = useCallback(async (email: string) => {
        await deleteEmail(email);

        toast.success(`Removed whitelist for: ${email}`);

        await refetch();
    }, [deleteEmail, refetch]);

    return (
        <Grid2 size={3}>
            <Paper>
                <Stack spacing={1} p={1}>
                    <span className="text-xl">Whitelisted Emails</span>
                    <span>Environment</span>
                    <Stack spacing={1} p={1}>
                        {environmentEmailsLoading
                            ? <Skeleton />
                            : environmentEmails === undefined || environmentEmails.length === 0
                                ? <span>No emails</span>
                                : environmentEmails.map((email) => <span key={email}>{email}</span>)}
                    </Stack>
                    <span>Database</span>
                    <Stack spacing={1} p={1}>
                        {databaseEmailsLoading
                            ? <Skeleton />
                            : isError ? <span>There was an error while loading database whitelist</span>
                                : databaseEmails.map(({ email, whitelistedBy }) => (
                                    <div key={email} className="flex flex-row items-center justify-between gap-1">
                                        <Stack spacing={0.5}>
                                            <span>{email}</span>
                                            <span className="text-xs">Approved by: {whitelistedBy.name}{whitelistedBy.email === user.email ? ' (you)' : ''}</span>
                                        </Stack>
                                        {email === user.email ? <span>(you)</span> : <IconButton size="large" onClick={() => handleDeleteEmail(email)}><FaTrash size={15} /></IconButton>}
                                    </div>
                                ))}
                        {!databaseEmailsLoading && !environmentEmailsLoading && (
                            <Formik
                                initialValues={{ email: '' }}
                                validate={async ({ email }) => {
                                    const errors: Partial<{ email: string}> = {};

                                    if (!email || !yup.string().email().isValidSync(email)) {
                                        errors.email = 'Please enter a valid email address';
                                    }

                                    if ([...databaseEmails?.map(({ email }) => email) ?? [], ...environmentEmails ?? []].includes(email)) {
                                        errors.email = `${email} is already whitelisted`;
                                    }

                                    return errors;
                                }}
                                onSubmit={async ({ email }, { resetForm }) => {
                                    await addEmail(email);

                                    toast.success(`Whitelisted: ${email}`);

                                    await refetch();

                                    resetForm();
                                }}
                            >
                                {(formik) => (
                                    <div className="flex flex-row items-center gap-1">
                                        <TextField
                                            label="New Email"
                                            variant="standard"
                                            fullWidth
                                            {...formikProps('email', formik, true)}
                                        />
                                        <IconButton size="large" onClick={formik.submitForm}><FaPlusCircle size={15} /></IconButton>
                                    </div>
                                )}
                            </Formik>
                        )}
                    </Stack>
                </Stack>
            </Paper>
        </Grid2>
    );
});

export default function EditRoot() {
    return (
        <Container sx={{ marginY: 5 }} maxWidth="xl">
            <Grid2 container spacing={2}>
                <EmailWhitelist />
            </Grid2>
        </Container>
    );
}
