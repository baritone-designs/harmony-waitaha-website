'use client';

import { trpc } from '@/common/trpc';
import { FieldArray, Formik, FormikConfig, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { ChorusId, Person, PersonChorus } from '@prisma/client';
import { Button, IconButton, TextField } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import { FaPlus, FaTrash } from 'react-icons/fa';
import SpinningCircles from 'react-loading-icons/dist/esm/components/spinning-circles';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import revalidate from '../revalidate';

const PersonSchema = yup.object().shape({
    name: yup
        .string()
        .min(3)
        .max(30)
        .required(),
    biography: yup
        .string()
        .min(10)
        .max(150)
        .required(),

    choruses: yup.array(yup.object().shape({
        chorusId: yup.mixed<ChorusId>().oneOf(Object.values(ChorusId)).required(),

        role: yup.string().min(2).max(30).required('Role is a required file'),
    })),
});

type PersonChorusData = Omit<PersonChorus, 'personId'>;

interface InitialValues {
    icon?: File;
    name: string;
    biography: string;
    choruses: PersonChorusData[];
}

interface PersonPaneProps {
    person?: Person & { choruses: PersonChorus[] };
    onSubmit: FormikConfig<InitialValues>['onSubmit'];
    onDelete?: () => void;
    layoutId?: string;
    onClose?: () => void;
}

function PersonPane({ person, onSubmit, onDelete, layoutId, onClose }: PersonPaneProps) {
    function formikProps<T extends FormikValues>(name: string, formik: FormikProps<T>) {
        const { value, onChange, onBlur } = formik.getFieldProps(name);
        const { error, touched } = formik.getFieldMeta(name);

        return ({
            value,
            onChange,
            onBlur,
            error: touched && Boolean(error),
            helperText: touched && JSON.stringify(error),
        });
    }

    return (
        <Formik<InitialValues>
            initialValues={{
                icon: undefined,
                name: person?.name ?? '',
                biography: person?.biography ?? '',
                choruses: person?.choruses.map(({ chorusId, role }) => ({ chorusId, role } satisfies PersonChorusData)) ?? [],
            }}
            validationSchema={PersonSchema}
            onSubmit={onSubmit}
        >
            {(formik) => (
                <m.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout layoutId={layoutId} className="relative flex flex-col items-center gap-3 rounded-md bg-slate-900 p-5">
                    {onClose && <RxCross2 className="absolute right-1 top-1 cursor-pointer hover:text-slate-500" onClick={onClose} />}
                    <TextField
                        name="name"
                        label="Name"
                        fullWidth
                        {...formikProps('name', formik)}
                    />
                    <TextField
                        name="biography"
                        label="Biography"
                        fullWidth
                        multiline
                        {...formikProps('biography', formik)}
                    />
                    <FieldArray
                        name="choruses"
                    >
                        {({ push, remove }) => (
                            <>
                                <ul>
                                    {formik.values.choruses.map((chorus, i) => (
                                        <m.li
                                            layout
                                            key={chorus.chorusId}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <div
                                                className="flex flex-row gap-1 overflow-hidden"
                                            >
                                                <TextField
                                                    variant="standard"
                                                    name={`choruses.${i}.role`}
                                                    label={`${chorus.chorusId} role`}
                                                    multiline
                                                    {...formikProps(`choruses.${i}.role`, formik)}
                                                />
                                                <IconButton size="large" onClick={() => remove(i)}><FaTrash size={15} /></IconButton>
                                            </div>
                                        </m.li>
                                    ))}
                                </ul>
                                <div className="flex flex-row items-center">
                                    {Object.values(ChorusId).map((chorusId) => (
                                        <Button
                                            key={chorusId}
                                            disabled={!!formik.values.choruses.find((chorus) => chorus.chorusId === chorusId)}
                                            onClick={() => push({
                                                chorusId,
                                                role: '',
                                            } satisfies PersonChorusData)}
                                            endIcon={<FaPlus />}
                                        >
                                            {chorusId}
                                        </Button>
                                    ))}
                                </div>
                            </>
                        )}
                    </FieldArray>
                    {formik.dirty && <Button onClick={formik.submitForm}>Save</Button>}
                    {onDelete && <Button onClick={onDelete}>Delete</Button>}
                    {formik.isSubmitting && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50">
                            <SpinningCircles />
                        </div>
                    )}
                </m.div>
            )}
        </Formik>

    );
}

export default function EditPeople() {
    const [people, { refetch }] = trpc.react.people.allPeople.useSuspenseQuery();

    const { mutateAsync: deletePerson } = trpc.react.people.deletePerson.useMutation();

    const { mutateAsync: editPerson } = trpc.react.people.editPerson.useMutation();

    const { mutateAsync: createPerson } = trpc.react.people.createPerson.useMutation();

    const [newPersonOpen, setNewPersonOpen] = useState(false);

    useEffect(() => {
        setNewPersonOpen(false);
    }, [people]);

    return (
        <div className="flex flex-row gap-5">
            <AnimatePresence>
                {people.map((person) => (
                    <PersonPane
                        key={person.id}
                        layoutId={person.id}
                        onSubmit={async ({ biography, name, choruses }, { resetForm }) => {
                            const newPerson = await editPerson({ id: person.id, biography, name, choruses });

                            toast.success(`Person: '${person.name}' updated`);

                            await refetch();

                            resetForm({ values: newPerson });

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
                {newPersonOpen ? (
                    <PersonPane
                        onClose={() => setNewPersonOpen(false)}
                        onSubmit={async ({ biography, name, choruses }) => {
                            await createPerson({ iconUrl: 'who knows', biography, name, choruses });

                            await refetch();
                        }}
                        layoutId="new-person"
                    />
                ) : <m.button onClick={() => setNewPersonOpen(true)} layoutId="new-person" className="h-min rounded-md bg-slate-900 p-3">New Person</m.button>}
            </AnimatePresence>
        </div>
    );
}
