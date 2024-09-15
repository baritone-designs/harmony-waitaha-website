'use client';

import { trpc } from '@/common/trpc';
import { Formik, FormikConfig } from 'formik';
import * as yup from 'yup';
import { QuartetSchema } from '@/common/schema';
import { ImageUpload } from '@/components/ImageUpload';
import { Quartet } from '@prisma/client';
import { AnimatePresence, m } from 'framer-motion';
import { Button, CircularProgress, TextField } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import { formikProps } from '@/components/formikUtils';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { NullableTextField } from '@/components/NullableTextField';
import revalidate from '../revalidate';

type QuartetSchemaType = yup.InferType<typeof QuartetSchema>

interface QuartetPaneProps {
    quartet?: Quartet;
    onSubmit: FormikConfig<QuartetSchemaType>['onSubmit'];
    onDelete?: () => void;
    layoutId?: string;
    onClose?: () => void;
}

function QuartetPane({ quartet, onSubmit, onDelete, layoutId, onClose }: QuartetPaneProps) {
    return (
        <Formik<QuartetSchemaType>
            initialValues={{
                id: quartet?.id ?? '',
                name: quartet?.name ?? '',
                biography: quartet?.biography ?? '',
                members: quartet?.members ?? { tenor: '', lead: '', bass: '', baritone: '' },
                socials: quartet?.socials ?? { facebook: null, instagram: null, x: null, youtube: null },
                logoUrl: quartet?.logoUrl ?? '',
                imageUrl: quartet?.logoUrl ?? '',
                backgroundImageUrl: quartet?.backgroundImageUrl ?? '',
                websiteUrl: quartet?.backgroundImageUrl ?? '',
            }}
            validationSchema={QuartetSchema}
            onSubmit={onSubmit}
        >
            {(formik) => (
                <m.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout layoutId={layoutId} className="relative flex flex-col items-center gap-3 rounded-md bg-slate-900 p-5">
                    {onClose && <RxCross2 className="absolute right-1 top-1 cursor-pointer hover:text-slate-500" onClick={onClose} />}
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

export default function EditQuartets() {
    const [quartets, { refetch }] = trpc.react.quartets.allQuartets.useSuspenseQuery();

    const { mutateAsync: createQuartet } = trpc.react.quartets.createQuartet.useMutation();

    const { mutateAsync: editQuartet } = trpc.react.quartets.editQuartet.useMutation();

    const { mutateAsync: deleteQuartet } = trpc.react.quartets.deleteQuartet.useMutation();

    const [newQuartetOpen, setNewQuartetOpen] = useState(false);

    return (
        <div className="flex flex-row gap-5">
            <AnimatePresence>
                {quartets.map((quartet) => (
                    <QuartetPane
                        key={quartet.id}
                        layoutId={quartet.id}
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
                {newQuartetOpen ? (
                    <QuartetPane
                        onClose={() => setNewQuartetOpen(false)}
                        onSubmit={async (person) => {
                            await createQuartet(person);

                            await refetch();
                            setNewQuartetOpen(false);

                            revalidate();
                        }}
                        layoutId="new-quartet"
                    />
                ) : <m.button onClick={() => setNewQuartetOpen(true)} layoutId="new-quartet" className="h-min rounded-md bg-slate-900 p-3">New Quartet</m.button>}
            </AnimatePresence>
        </div>
    );
}
