'use client';

import { ChorusSchema } from '@/common/schema';
import { trpc } from '@/common/trpc';
import { MediaUpload } from '@/components/MediaUpload';
import { Box, Button, Grid2, Paper, Skeleton, Stack, TextField } from '@mui/material';
import { ChorusId } from '@prisma/client';
import { Formik } from 'formik';
import { Suspense } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import SocialsEditor from '@/components/SocialsEditor';
import revalidate from './revalidate';

type ChorusSchemaType = yup.InferType<typeof ChorusSchema>

interface ChorusPaneProps {
    chorus: ChorusId;
}

function ChorusPane({ chorus }: ChorusPaneProps) {
    const [chorusContent, { refetch }] = trpc.react.choruses.getChorus.useSuspenseQuery(chorus);
    const { mutateAsync: updateChorus } = trpc.react.choruses.setChorus.useMutation();

    return (
        <Grid2 size={4}>
            <Formik<ChorusSchemaType>
                initialValues={chorusContent}
                validationSchema={ChorusSchema}
                onSubmit={async (content, { resetForm }) => {
                    await updateChorus({ id: chorus, ...content });

                    toast.success(`Content for ${chorus} updated`);

                    await refetch();

                    resetForm({ values: content });

                    revalidate();
                }}
            >
                {(formik) => (
                    <Paper>
                        <Stack spacing={1} p={2}>
                            <span className="text-xl">{chorus}</span>
                            <SocialsEditor fieldName="socials" formik={formik} />
                            <MediaUpload
                                name="imageUrl"
                                label="Image"
                                acceptedTypes={['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']}
                            >
                                {({ src }) => (
                                    <img
                                        src={src}
                                        alt="page-logo"
                                        className="size-full duration-200 group-hover:opacity-50"
                                    />
                                )}
                            </MediaUpload>
                            {formik.dirty && <Button variant="outlined" onClick={formik.submitForm}>Save</Button>}
                        </Stack>
                    </Paper>
                )}
            </Formik>
        </Grid2>
    );
}

function LoadingPane({ chorus }: ChorusPaneProps) {
    return (
        <Grid2 size={4}>
            <Paper>
                <Stack spacing={1} p={2}>
                    <span className="text-xl">{chorus}</span>
                    <Skeleton>
                        <TextField />
                    </Skeleton>
                    <Skeleton>
                        <TextField />
                    </Skeleton>
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

export default function EditChoruses() {
    return (
        <Grid2 container spacing={2}>
            {Object.keys(ChorusId).map((chorus) => (
                <Suspense key={chorus} fallback={<LoadingPane chorus={chorus as ChorusId} />}>
                    <ChorusPane chorus={chorus as ChorusId} />
                </Suspense>
            ))}
        </Grid2>
    );
}
