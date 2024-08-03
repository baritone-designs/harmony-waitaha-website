'use client';

import { trpc } from '@/common/trpc';
import { ImageUpload } from '@/components/ImageUpload';
import { Formik } from 'formik';
import { upload } from '@vercel/blob/client';

export default function EditPeople() {
    const [people] = trpc.react.people.allPeople.useSuspenseQuery();

    return (
        <div className="flex flex-row gap-5">
            {people.map((person) => (
                <Formik<{ icon: File | undefined }>
                    initialValues={{ icon: undefined }}
                    onSubmit={async ({ icon }, { setFieldError, resetForm }) => {
                        if (!icon) {
                            return;
                        }

                        await upload(icon.name, icon, {
                            access: 'public',
                            handleUploadUrl: '/api/person-icon',
                            clientPayload: person.id,
                        }).catch((e) => {
                            resetForm();
                            setFieldError('icon', e.toString());
                        });
                    }}
                >
                    {({ submitForm }) => (
                        <div className="flex flex-col items-center gap-3 rounded-md bg-slate-900 p-5">
                            {person.name}
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
                            <button onClick={submitForm} type="button">Upload</button>
                        </div>
                    )}
                </Formik>
            ))}
        </div>
    );
}
