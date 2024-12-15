'use client';

import { trpc } from '@/common/trpc';
import { Formik, FormikConfig } from 'formik';
import * as yup from 'yup';
import { QuartetSchema } from '@/common/schema';
import { ImageUpload } from '@/components/ImageUpload';
import { Quartet } from '@prisma/client';
import { Backdrop, Button, CircularProgress, Container, Fab, Grid2, IconButton, Paper, Stack, TextField } from '@mui/material';
import { formikProps } from '@/components/formikUtils';
import { toast } from 'react-toastify';
import { useCallback, useState } from 'react';
import { NullableTextField } from '@/components/NullableTextField';
import { Add, Close } from '@mui/icons-material';
import revalidate from '../revalidate';

type QuartetSchemaType = yup.InferType<typeof QuartetSchema>

type QuartetPaneProps = {
    onSubmit: FormikConfig<QuartetSchemaType>['onSubmit'];
} & ({
    type: 'existing';
    quartet: Quartet;
    onDelete?: () => void;
} | {
    type: 'new';
    quartet?: Quartet;
    onClose: () => void;
})

function QuartetPane({ quartet, onSubmit, ...props }: QuartetPaneProps) {
    return (
        <Grid2 size={3}>
            <Formik<QuartetSchemaType>
                initialValues={{
                    id: quartet?.id ?? '',
                    name: quartet?.name ?? '',
                    biography: quartet?.biography ?? '',
                    members: quartet?.members ?? { tenor: '', lead: '', bass: '', baritone: '' },
                    socials: quartet?.socials ?? { facebook: null, instagram: null, x: null, youtube: null },
                    logoUrl: quartet?.logoUrl ?? null,
                    imageUrl: quartet?.imageUrl ?? null,
                    backgroundImageUrl: quartet?.backgroundImageUrl ?? null,
                    websiteUrl: quartet?.websiteUrl ?? null,
                }}
                validationSchema={QuartetSchema}
                onSubmit={onSubmit}
            >
                {(formik) => (
                    <Paper className="relative">
                        {props.type === 'new' && <IconButton sx={{ position: 'absolute', right: 2, top: 2, zIndex: 10 }} onClick={props.onClose}><Close /></IconButton>}
                        <Stack spacing={1} p={2}>
                            <TextField
                                label="Id"
                                variant="standard"
                                fullWidth
                                {...formikProps('id', formik)}
                            />
                            <TextField
                                label="Name"
                                variant="standard"
                                fullWidth
                                {...formikProps('name', formik)}
                            />
                            <TextField
                                label="Biography"
                                variant="standard"
                                fullWidth
                                multiline
                                {...formikProps('biography', formik)}
                            />
                            <TextField
                                label="Website"
                                variant="standard"
                                fullWidth
                                {...formikProps('websiteUrl', formik)}
                            />
                            <div className="grid grid-cols-2 grid-rows-2 gap-2 self-stretch">
                                {Object.keys(formik.values.members).map((key) => (
                                    <TextField variant="standard" label={key} fullWidth {...formikProps(`members.${key}`, formik)} />
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-2 self-stretch">
                                {Object.keys(formik.values.socials).map((key) => (
                                    <NullableTextField variant="standard" label={key} fullWidth {...formikProps(`socials.${key}`, formik)} />
                                ))}
                            </div>
                            <ImageUpload name="logoUrl" label="Quartet Logo">
                                {({ src }) => (
                                    // next/image crashes without width/height props
                                    //  eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={src}
                                        alt="quartet-logo"
                                        className="h-36 w-36 rounded-full duration-200 group-hover:opacity-50"
                                    />
                                )}
                            </ImageUpload>
                            <ImageUpload name="imageUrl" label="Quartet Image">
                                {({ src }) => (
                                    // next/image crashes without width/height props
                                    //  eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={src}
                                        alt="quartet-logo"
                                        className="h-44 w-96 rounded-md duration-200 group-hover:opacity-50"
                                    />
                                )}
                            </ImageUpload>
                            <ImageUpload name="backgroundImageUrl" label="Background Image">
                                {({ src }) => (
                                    // next/image crashes without width/height props
                                    //  eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={src}
                                        alt="quartet-logo"
                                        className="h-44 w-96 rounded-md duration-200 group-hover:opacity-50"
                                    />
                                )}
                            </ImageUpload>
                            {(formik.dirty || props.type === 'new') && <Button variant="outlined" onClick={formik.submitForm}>{props.type === 'existing' ? 'Update' : 'Save'}</Button>}
                            {props.type === 'existing' && <Button variant="outlined" color="error" onClick={props.onDelete}>Delete</Button>}
                            <Backdrop sx={{ position: 'absolute' }} open={formik.isSubmitting}>
                                <CircularProgress />
                            </Backdrop>
                        </Stack>
                    </Paper>
                )}
            </Formik>
        </Grid2>
    );
}

export default function EditQuartets() {
    const [quartets, { refetch }] = trpc.react.quartets.allQuartets.useSuspenseQuery();

    const { mutateAsync: createQuartet } = trpc.react.quartets.createQuartet.useMutation();

    const { mutateAsync: editQuartet } = trpc.react.quartets.editQuartet.useMutation();

    const { mutateAsync: deleteQuartet } = trpc.react.quartets.deleteQuartet.useMutation();

    const [newQuartets, setNewQuartets] = useState<string[]>([]);

    const closeNewQuartet = useCallback(
        (id: string) => setNewQuartets((quartets) => quartets.filter((x) => x !== id)),
        [setNewQuartets],
    );
    return (
        <Container sx={{ marginY: 5 }} maxWidth="xl">
            <Grid2 container spacing={2}>
                {quartets.map((quartet) => (
                    <QuartetPane
                        type="existing"
                        key={quartet.id}
                        onSubmit={async (values, { resetForm }) => {
                            await editQuartet({ previousId: quartet.id, ...values });

                            toast.success(`Quartet: '${quartet.name}' updated`);

                            await refetch();

                            resetForm({ values });

                            revalidate();
                        }}
                        onDelete={async () => {
                            await deleteQuartet(quartet.id);

                            toast.success(`Quartet: '${quartet.name}' deleted`);

                            await refetch();

                            revalidate();
                        }}
                        quartet={quartet}
                    />
                ))}
                {newQuartets.map((id) => (
                    <QuartetPane
                        type="new"
                        key={id}
                        onClose={() => closeNewQuartet(id)}
                        onSubmit={async (person) => {
                            await createQuartet(person);

                            await refetch();
                            closeNewQuartet(id);

                            revalidate();
                        }}
                    />
                ))}
            </Grid2>
            <Fab
                variant="extended"
                color="primary"
                onClick={() => setNewQuartets((quartets) => [...quartets, Math.random().toString(36).slice(2, 7)])}
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                <Add sx={{ mr: 1 }} />
                New Quartet
            </Fab>
        </Container>
    );
}
