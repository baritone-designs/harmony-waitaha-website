'use client';

import { trpc } from '@/common/trpc';
import { FieldArray, Formik, FormikConfig } from 'formik';
import * as yup from 'yup';
import { ChorusId, Person } from '@prisma/client';
import { Button, CircularProgress, Container, Fab, Grid2, IconButton, List, ListItem, Paper, Stack, TextField, Box, Backdrop } from '@mui/material';
import { toast } from 'react-toastify';
import { useCallback, useState } from 'react';
import { formikProps } from '@/components/formikUtils';
import { MediaUpload } from '@/components/MediaUpload';
import { PersonChorusSchema, PersonSchema } from '@/common/schema';
import { Add, Close, Delete } from '@mui/icons-material';
import revalidate from '../revalidate';

type PersonSchemaType = yup.InferType<typeof PersonSchema>

type PersonPaneProps = {
    onSubmit: FormikConfig<PersonSchemaType>['onSubmit'];
} & ({
    type: 'existing';
    person: Person & { choruses: yup.InferType<typeof PersonChorusSchema>[] };
    onDelete?: () => void;
} | {
    type: 'new';
    person?: Person & { choruses: yup.InferType<typeof PersonChorusSchema>[] };
    onClose: () => void;
})

function PersonPane({ person, onSubmit, ...props }: PersonPaneProps) {
    return (
        <Grid2 size={3}>
            <Formik<PersonSchemaType>
                initialValues={{
                    iconUrl: person?.iconUrl ?? '',
                    name: person?.name ?? '',
                    biography: person?.biography ?? '',
                    choruses: person?.choruses ?? [],
                }}
                validationSchema={PersonSchema}
                onSubmit={onSubmit}
            >
                {(formik) => (
                    <Paper className="relative">
                        {props.type === 'new' && <IconButton sx={{ position: 'absolute', right: 2, top: 2, zIndex: 10 }} onClick={props.onClose}><Close /></IconButton>}
                        <Stack spacing={1} p={2}>
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
                            <FieldArray
                                name="choruses"
                            >
                                {({ push, remove }) => (
                                    <>
                                        <List>
                                            {formik.values.choruses.map((chorus, i) => (
                                                <ListItem
                                                    key={chorus.chorusId}
                                                >
                                                    <TextField
                                                        variant="standard"
                                                        label={`${chorus.chorusId} role`}
                                                        multiline
                                                        {...formikProps(`choruses.${i}.role`, formik)}
                                                    />
                                                    <IconButton size="large" onClick={() => remove(i)}><Delete /></IconButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                        <Box>
                                            {Object.values(ChorusId).map((chorusId) => (
                                                <Button
                                                    key={chorusId}
                                                    disabled={!!formik.values.choruses.find((chorus) => chorus.chorusId === chorusId)}
                                                    onClick={() => push<yup.InferType<typeof PersonChorusSchema>>({
                                                        chorusId,
                                                        role: '',
                                                    })}
                                                    endIcon={<Add />}
                                                >
                                                    {chorusId}
                                                </Button>
                                            ))}
                                        </Box>
                                    </>
                                )}
                            </FieldArray>
                            <MediaUpload name="iconUrl" label="Person Icon" acceptedTypes={['image/png', 'image/jpeg']}>
                                {({ src }) => (
                                    // next/image crashes without width/height props
                                    //  eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={src}
                                        alt="person-icon"
                                        className="size-36 rounded-full object-cover duration-200 group-hover:opacity-50"
                                    />
                                )}
                            </MediaUpload>
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

export default function EditPeople() {
    const [people, { refetch }] = trpc.react.people.allPeople.useSuspenseQuery();

    const { mutateAsync: deletePerson } = trpc.react.people.deletePerson.useMutation();

    const { mutateAsync: editPerson } = trpc.react.people.editPerson.useMutation();

    const { mutateAsync: createPerson } = trpc.react.people.createPerson.useMutation();

    const [newPeople, setNewPeople] = useState<string[]>([]);

    const closeNewPerson = useCallback(
        (id: string) => setNewPeople((people) => people.filter((x) => x !== id)),
        [setNewPeople],
    );

    return (
        <Container sx={{ marginY: 5 }} maxWidth="xl">
            <Grid2 container spacing={2}>
                {people.map((person) => (
                    <PersonPane
                        type="existing"
                        key={person.id}
                        onSubmit={async (values, { resetForm }) => {
                            await editPerson({ id: person.id, ...values });

                            toast.success(`Person: '${person.name}' updated`);

                            await refetch();

                            resetForm({ values });

                            revalidate();
                        }}
                        onDelete={async () => {
                            await deletePerson(person.id);

                            toast.success(`Person: '${person.name}' deleted`);

                            await refetch();

                            revalidate();
                        }}
                        person={person}
                    />
                ))}
                {newPeople.map((id) => (
                    <PersonPane
                        type="new"
                        key={id}
                        onClose={() => closeNewPerson(id)}
                        onSubmit={async (person) => {
                            await createPerson(person);

                            await refetch();
                            closeNewPerson(id);

                            revalidate();
                        }}
                    />
                ))}
            </Grid2>
            <Fab
                variant="extended"
                color="primary"
                onClick={() => setNewPeople((people) => [...people, Math.random().toString(36).slice(2, 7)])}
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                <Add sx={{ mr: 1 }} />
                New Person
            </Fab>
        </Container>
    );
}
