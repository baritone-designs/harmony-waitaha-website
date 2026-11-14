'use client';

import { DEFAULT_REQUIRED_FIELD_MESSAGE } from '@/common/constants';
import { PersonSchema } from '@/common/schema';
import { CHORUS_INFO } from '@/common/sites';
import { trpc } from '@/common/trpc';
import { formikProps } from '@/components/formikUtils';
import { MediaUpload } from '@/components/MediaUpload';
import { PersonAdd } from '@mui/icons-material';
import { Autocomplete, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import { ChorusId } from '@prisma/client';
import { Formik, useFormikContext } from 'formik';
import { useState } from 'react';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@/server';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import ConfirmButton from '../_components/ConfirmButton';
import ItemCard from '../_components/ItemCard';
import TabToolbar, { ITEM_GRID_SIZE } from '../_components/TabToolbar';
import useNewItems from '../_components/useNewItems';
import revalidate from '../revalidate';

/** A person as edited from a single chorus' point of view: their details plus their role in this chorus */
const MemberSchema = PersonSchema.omit(['choruses']).concat(yup.object({
    role: yup.string().required(DEFAULT_REQUIRED_FIELD_MESSAGE),
}));

type MemberValues = yup.InferType<typeof MemberSchema>;

type PersonWithChoruses = inferRouterOutputs<AppRouter>['people']['allPeople'][number];

function MemberFields() {
    const formik = useFormikContext<MemberValues>();

    return (
        <>
            <MediaUpload name="iconUrl" label="photo" acceptedTypes={['image/png', 'image/jpeg', 'image/webp']}>
                {({ src }) => (
                    <img src={src} alt="person-icon" className="size-32 rounded-full object-cover duration-200 group-hover:opacity-50" />
                )}
            </MediaUpload>
            <TextField label="Name" variant="standard" fullWidth {...formikProps('name', formik)} />
            <TextField label="Role" placeholder="e.g. Musical Director" variant="standard" fullWidth {...formikProps('role', formik)} />
            <TextField label="Biography" variant="standard" fullWidth multiline {...formikProps('biography', formik)} />
        </>
    );
}

interface AddExistingDialogProps {
    chorusId: ChorusId;
    candidates: PersonWithChoruses[];
    open: boolean;
    onClose: () => void;
    onAdd: (person: PersonWithChoruses, role: string) => Promise<void>;
}

function AddExistingDialog({ chorusId, candidates, open, onClose, onAdd }: AddExistingDialogProps) {
    const [person, setPerson] = useState<PersonWithChoruses | null>(null);
    const [role, setRole] = useState('');
    const [saving, setSaving] = useState(false);

    const close = () => {
        setPerson(null);
        setRole('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
            <DialogTitle>
                Add an existing person to
                {' '}
                {CHORUS_INFO[chorusId].name}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} pt={1}>
                    <Autocomplete
                        options={candidates}
                        value={person}
                        onChange={(_, value) => setPerson(value)}
                        getOptionLabel={(option) => `${option.name} (${option.choruses.map(({ chorusId: id }) => CHORUS_INFO[id].name).join(', ') || 'no chorus'})`}
                        getOptionKey={(option) => option.id}
                        renderInput={(params) => <TextField {...params} label="Person" />}
                    />
                    <TextField label="Role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Musical Director" />
                    <Typography variant="body2" color="text.secondary">
                        Their name, photo and biography are shared between choruses, but they can have a different role in each.
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Cancel</Button>
                <Button
                    variant="contained"
                    disabled={!person || !role}
                    loading={saving}
                    onClick={async () => {
                        setSaving(true);
                        try {
                            await onAdd(person!, role);
                            close();
                        } finally {
                            setSaving(false);
                        }
                    }}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function PeopleEditor({ chorusId }: { chorusId: ChorusId }) {
    const chorusName = CHORUS_INFO[chorusId].name;

    const [allPeople, { refetch }] = trpc.react.people.allPeople.useSuspenseQuery();
    const { mutateAsync: createPerson } = trpc.react.people.createPerson.useMutation();
    const { mutateAsync: editPerson } = trpc.react.people.editPerson.useMutation();
    const { mutateAsync: deletePerson } = trpc.react.people.deletePerson.useMutation();

    const [newPeople, addNewPerson, removeNewPerson] = useNewItems();
    const [addExistingOpen, setAddExistingOpen] = useState(false);

    const members = allPeople.filter((person) => person.choruses.some((chorus) => chorus.chorusId === chorusId));
    const nonMembers = allPeople.filter((person) => !members.includes(person));

    const refresh = async () => {
        await refetch();
        revalidate();
    };

    return (
        <Stack spacing={2}>
            <TabToolbar
                description={`People shown in the about section of the ${chorusName} page.`}
                addLabel="New person"
                onAdd={addNewPerson}
                actions={nonMembers.length > 0 && (
                    <Button startIcon={<PersonAdd />} onClick={() => setAddExistingOpen(true)}>Add existing person</Button>
                )}
            />
            <Grid container spacing={2}>
                {newPeople.map((key) => (
                    <Grid key={key} size={ITEM_GRID_SIZE}>
                        <Formik<MemberValues>
                            initialValues={{ name: '', biography: '', iconUrl: '', role: '' }}
                            validationSchema={MemberSchema}
                            onSubmit={async ({ role, ...person }) => {
                                await createPerson({ ...person, choruses: [{ chorusId, role }] });

                                toast.success(`${person.name} added to ${chorusName}`);

                                removeNewPerson(key);

                                await refresh();
                            }}
                        >
                            <ItemCard isNew onCancel={() => removeNewPerson(key)}>
                                <MemberFields />
                            </ItemCard>
                        </Formik>
                    </Grid>
                ))}
                {members.map((person) => {
                    const otherChoruses = person.choruses.filter((chorus) => chorus.chorusId !== chorusId);
                    const otherChorusNames = otherChoruses.map((chorus) => CHORUS_INFO[chorus.chorusId].name).join(', ');

                    return (
                        <Grid key={person.id} size={ITEM_GRID_SIZE}>
                            <Formik<MemberValues>
                                initialValues={{
                                    name: person.name,
                                    biography: person.biography,
                                    iconUrl: person.iconUrl,
                                    role: person.choruses.find((chorus) => chorus.chorusId === chorusId)!.role,
                                }}
                                validationSchema={MemberSchema}
                                onSubmit={async ({ role, ...values }, { resetForm }) => {
                                    await editPerson({
                                        id: person.id,
                                        ...values,
                                        choruses: person.choruses.map((chorus) => (chorus.chorusId === chorusId ? { chorusId, role } : chorus)),
                                    });

                                    toast.success(`${values.name} updated`);

                                    resetForm({ values: { role, ...values } });

                                    await refresh();
                                }}
                            >
                                <ItemCard
                                    header={otherChoruses.length > 0 && (
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            {otherChoruses.map((chorus) => (
                                                <Chip key={chorus.chorusId} size="small" label={`Also in ${CHORUS_INFO[chorus.chorusId].name}`} />
                                            ))}
                                        </Stack>
                                    )}
                                    deleteButton={(
                                        <ConfirmButton
                                            color="error"
                                            title={`Remove ${person.name}?`}
                                            confirmLabel="Remove"
                                            message={otherChoruses.length > 0
                                                ? `${person.name} will be removed from ${chorusName}, but will stay in ${otherChorusNames}.`
                                                : `${person.name} will be permanently deleted.`}
                                            onConfirm={async () => {
                                                if (otherChoruses.length > 0) {
                                                    await editPerson({ id: person.id, choruses: otherChoruses });
                                                } else {
                                                    await deletePerson(person.id);
                                                }

                                                toast.success(`${person.name} removed from ${chorusName}`);

                                                await refresh();
                                            }}
                                        >
                                            Remove
                                        </ConfirmButton>
                                    )}
                                >
                                    <MemberFields />
                                </ItemCard>
                            </Formik>
                        </Grid>
                    );
                })}
            </Grid>
            {members.length === 0 && newPeople.length === 0 && (
                <Typography color="text.secondary" textAlign="center" py={4}>
                    There is no one in
                    {' '}
                    {chorusName}
                    {' '}
                    yet.
                </Typography>
            )}
            <AddExistingDialog
                chorusId={chorusId}
                candidates={nonMembers}
                open={addExistingOpen}
                onClose={() => setAddExistingOpen(false)}
                onAdd={async (person, role) => {
                    await editPerson({ id: person.id, choruses: [...person.choruses, { chorusId, role }] });

                    toast.success(`${person.name} added to ${chorusName}`);

                    await refresh();
                }}
            />
        </Stack>
    );
}
