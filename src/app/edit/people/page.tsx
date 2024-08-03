'use client';

import { trpc } from '@/common/trpc';
import { ImageUpload } from '@/components/ImageUpload';
import { Field, Formik } from 'formik';
import { upload } from '@vercel/blob/client';
import * as yup from 'yup';

export const UrlCompliant = /^[\w-]*$/;

export const PersonSchema = yup.object().shape({
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
    id: yup
        .string()
        .min(2)
        .max(30)
        .matches(UrlCompliant, 'Must not contain special characters')
        .required(),
});

export default function EditPeople() {
    const [people] = trpc.react.people.allPeople.useSuspenseQuery();

    const { mutateAsync: editPerson } = trpc.react.people.editPerson.useMutation();

    return (
        <div className="flex flex-row gap-5">
            {people.map((person) => (
                <Formik<{ icon: File | undefined, id: string, name: string, biography: string }>
                    initialValues={{ icon: undefined, id: person.id, name: person.name, biography: person.biography }}
                    onSubmit={async ({ icon, id, name, biography }, { setFieldError, resetForm }) => {
                        const newPerson = await editPerson({ previousId: person.id, newId: id, biography, name });

                        if (icon) {
                            await upload(icon.name, icon, {
                                access: 'public',
                                handleUploadUrl: '/api/person-icon',
                                clientPayload: newPerson.id,
                            }).catch((e) => {
                                resetForm();
                                setFieldError('icon', e.toString());
                            });
                        }

                        window.alert(`Person ${name} updated`);
                    }}
                    validationSchema={PersonSchema}
                >
                    {({ submitForm, errors }) => (
                        <div className="flex flex-col items-center gap-3 rounded-md bg-slate-900 p-5">
                            <Field name="name" />{errors.name}
                            <Field name="id" />{errors.id}
                            <Field name="biography" />{errors.biography}
                            <ImageUpload
                                name="icon"
                                existingImageUrl={person.iconUrl}
                            >
                                {({ imageUrl, onSelectImage, error }) => (
                                    <button className="group relative cursor-pointer" type="button" onClick={onSelectImage}>
                                        {/* next/image crashes without width/height props */}
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={imageUrl}
                                            alt="profile"
                                            className="h-36 w-36 rounded-full duration-200 group-hover:opacity-50"
                                        />
                                        <span>{error}</span>
                                        <span className="absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 opacity-0 duration-200 group-hover:opacity-100">Change Avatar</span>
                                    </button>
                                )}
                            </ImageUpload>
                            <button onClick={submitForm} type="button">Save</button>
                        </div>
                    )}
                </Formik>
            ))}
        </div>
    );
}
