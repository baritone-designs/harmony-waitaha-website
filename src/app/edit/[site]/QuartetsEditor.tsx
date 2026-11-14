'use client';

import { QuartetSchema } from '@/common/schema';
import { trpc } from '@/common/trpc';
import { formikProps } from '@/components/formikUtils';
import { MediaUpload } from '@/components/MediaUpload';
import { NullableTextField } from '@/components/NullableTextField';
import SocialsEditor from '@/components/SocialsEditor';
import { Grid, Stack, TextField, Typography } from '@mui/material';
import { Formik, useFormikContext } from 'formik';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import ConfirmButton from '../_components/ConfirmButton';
import ItemCard from '../_components/ItemCard';
import TabToolbar, { ITEM_GRID_SIZE } from '../_components/TabToolbar';
import useNewItems from '../_components/useNewItems';
import revalidate from '../revalidate';

type QuartetValues = yup.InferType<typeof QuartetSchema>;

const EMPTY_QUARTET: QuartetValues = {
    id: '',
    name: '',
    biography: '',
    members: { tenor: '', lead: '', baritone: '', bass: '' },
    socials: { facebook: null, instagram: null, tiktok: null, youtube: null },
    logoUrl: null,
    imageUrl: null,
    backgroundImageUrl: null,
    websiteUrl: null,
};

function QuartetFields() {
    const formik = useFormikContext<QuartetValues>();

    return (
        <>
            <TextField label="Name" variant="standard" fullWidth {...formikProps('name', formik)} />
            <TextField
                label="Link id"
                variant="standard"
                fullWidth
                {...formikProps('id', formik)}
                helperText={formik.touched.id && formik.errors.id
                    ? formik.errors.id
                    : `Used in the quartet's link: harmonywaitaha.co.nz/?quartet=${formik.values.id || '…'}`}
            />
            <TextField label="Biography" variant="standard" fullWidth multiline {...formikProps('biography', formik)} />
            <NullableTextField label="Website" variant="standard" fullWidth {...formikProps('websiteUrl', formik)} />
            <div className="grid grid-cols-2 gap-2">
                {Object.keys(formik.values.members).map((part) => (
                    <TextField key={part} variant="standard" label={part} fullWidth {...formikProps(`members.${part}`, formik)} />
                ))}
            </div>
            <SocialsEditor fieldName="socials" formik={formik} />
            <MediaUpload name="logoUrl" label="logo" acceptedTypes={['image/png', 'image/svg+xml']}>
                {({ src }) => <img src={src} alt="quartet-logo" className="size-32 rounded-full object-contain duration-200 group-hover:opacity-50" />}
            </MediaUpload>
            <MediaUpload name="imageUrl" label="photo" acceptedTypes={['image/png', 'image/jpeg']}>
                {({ src }) => <img src={src} alt="quartet" className="aspect-video w-full rounded-md object-cover duration-200 group-hover:opacity-50" />}
            </MediaUpload>
            <MediaUpload name="backgroundImageUrl" label="background image" acceptedTypes={['image/png', 'image/jpeg']}>
                {({ src }) => <img src={src} alt="quartet-background" className="aspect-video w-full rounded-md object-cover duration-200 group-hover:opacity-50" />}
            </MediaUpload>
        </>
    );
}

export default function QuartetsEditor() {
    const [quartets, { refetch }] = trpc.react.quartets.allQuartets.useSuspenseQuery();
    const { mutateAsync: createQuartet } = trpc.react.quartets.createQuartet.useMutation();
    const { mutateAsync: editQuartet } = trpc.react.quartets.editQuartet.useMutation();
    const { mutateAsync: deleteQuartet } = trpc.react.quartets.deleteQuartet.useMutation();

    const [newQuartets, addNewQuartet, removeNewQuartet] = useNewItems();

    const refresh = async () => {
        await refetch();
        revalidate();
    };

    return (
        <Stack spacing={2}>
            <TabToolbar
                description="Quartets shown on the Harmony Waitaha homepage."
                addLabel="New quartet"
                onAdd={addNewQuartet}
            />
            <Grid container spacing={2}>
                {newQuartets.map((key) => (
                    <Grid key={key} size={ITEM_GRID_SIZE}>
                        <Formik<QuartetValues>
                            initialValues={EMPTY_QUARTET}
                            validationSchema={QuartetSchema}
                            onSubmit={async (values) => {
                                await createQuartet(values);

                                toast.success(`Quartet '${values.name}' created`);

                                removeNewQuartet(key);

                                await refresh();
                            }}
                        >
                            <ItemCard isNew onCancel={() => removeNewQuartet(key)}>
                                <QuartetFields />
                            </ItemCard>
                        </Formik>
                    </Grid>
                ))}
                {quartets.map((quartet) => (
                    <Grid key={quartet.id} size={ITEM_GRID_SIZE}>
                        <Formik<QuartetValues>
                            initialValues={quartet}
                            validationSchema={QuartetSchema}
                            onSubmit={async ({ id, ...values }, { resetForm }) => {
                                await editQuartet({ previousId: quartet.id, newId: id, ...values });

                                toast.success(`Quartet '${values.name}' updated`);

                                resetForm({ values: { id, ...values } });

                                await refresh();
                            }}
                        >
                            <ItemCard
                                deleteButton={(
                                    <ConfirmButton
                                        color="error"
                                        title={`Delete '${quartet.name}'?`}
                                        confirmLabel="Delete"
                                        message="This quartet will be removed from the Harmony Waitaha homepage."
                                        onConfirm={async () => {
                                            await deleteQuartet(quartet.id);

                                            toast.success(`Quartet '${quartet.name}' deleted`);

                                            await refresh();
                                        }}
                                    >
                                        Delete
                                    </ConfirmButton>
                                )}
                            >
                                <QuartetFields />
                            </ItemCard>
                        </Formik>
                    </Grid>
                ))}
            </Grid>
            {quartets.length === 0 && newQuartets.length === 0 && (
                <Typography color="text.secondary" textAlign="center" py={4}>There are no quartets yet.</Typography>
            )}
        </Stack>
    );
}
