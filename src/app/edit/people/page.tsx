'use client';

import { trpc } from '@/common/trpc';
import { FieldArray, Formik, FormikConfig } from 'formik';
import * as yup from 'yup';
import { ChorusId, Person } from '@prisma/client';
import { Button, CircularProgress, IconButton, TextField } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { formikProps } from '@/components/formikUtils';
import { ImageUpload } from '@/components/ImageUpload';
import { PersonChorusSchema, PersonSchema } from '@/common/schema';
import revalidate from '../revalidate';

type PersonSchemaType = yup.InferType<typeof PersonSchema>

interface PersonPaneProps {
    person?: Person & { choruses: yup.InferType<typeof PersonChorusSchema>[] };
    onSubmit: FormikConfig<PersonSchemaType>['onSubmit'];
    onDelete?: () => void;
    layoutId?: string;
    onClose?: () => void;
}

function PersonPane({ person, onSubmit, onDelete, layoutId, onClose }: PersonPaneProps) {
    return (
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
                <m.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout layoutId={layoutId} className="relative flex flex-col items-center gap-3 rounded-md bg-slate-900 p-5">
                    {onClose && <RxCross2 className="absolute right-1 top-1 cursor-pointer hover:text-slate-500" onClick={onClose} />}
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
                                            onClick={() => push<yup.InferType<typeof PersonChorusSchema>>({
                                                chorusId,
                                                role: '',
                                            })}
                                            endIcon={<FaPlus />}
                                        >
                                            {chorusId}
                                        </Button>
                                    ))}
                                </div>
                            </>
                        )}
                    </FieldArray>
                    <ImageUpload name="iconUrl" label="Person Icon">
                        {({ src }) => (
                            // next/image crashes without width/height props
                            //  eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={src}
                                alt="person-icon"
                                className="h-36 w-36 rounded-full duration-200 group-hover:opacity-50"
                            />
                        )}
                    </ImageUpload>
                    {formik.dirty && <Button onClick={formik.submitForm}>Save</Button>}
                    {onDelete && <Button onClick={onDelete}>Delete</Button>}
                    {formik.isSubmitting && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50">
                            <CircularProgress />
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

    return (
        <div className="flex flex-row gap-5">
            <AnimatePresence>
                {people.map((person) => (
                    <PersonPane
                        key={person.id}
                        layoutId={person.id}
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
                {newPersonOpen ? (
                    <PersonPane
                        onClose={() => setNewPersonOpen(false)}
                        onSubmit={async (person) => {
                            await createPerson(person);

                            await refetch();
                            setNewPersonOpen(false);

                            revalidate();
                        }}
                        layoutId="new-person"
                    />
                ) : <m.button onClick={() => setNewPersonOpen(true)} layoutId="new-person" className="h-min rounded-md bg-slate-900 p-3">New Person</m.button>}
            </AnimatePresence>
        </div>
    );
}
