'use client';

import { trpc } from '@/common/trpc';
import { Field, Formik } from 'formik';
import * as yup from 'yup';
import { URL_COMPLIANT_REGEX } from '@/common/constants';
import { QuartetMembersSchema, QuartetSocialsSchema } from '@/common/schema';
import { NullableTextField } from '@/components/NullableTextField';
import { ImageUpload } from '@/components/ImageUpload';
import { upload } from '@vercel/blob/client';
import revalidate from '../revalidate';

const QuartetSchema = yup.object().shape({
    id: yup
        .string()
        .min(2)
        .max(30)
        .matches(URL_COMPLIANT_REGEX, 'Must not contain special characters')
        .required(),
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

    members: QuartetMembersSchema,

    socials: QuartetSocialsSchema,

    websiteUrl: yup.string().url(),
});

export default function EditQuartets() {
    const [quartets, { refetch }] = trpc.react.quartets.allQuartets.useSuspenseQuery();

    const { mutateAsync: createQuartet } = trpc.react.quartets.createQuartet.useMutation();

    const { mutateAsync: editQuartet } = trpc.react.quartets.editQuartet.useMutation();

    const { mutateAsync: deleteQuartet } = trpc.react.quartets.deleteQuartet.useMutation();

    return (
        <div className="flex flex-row gap-5">
            {quartets.map((quartet) => (
                <Formik
                    key={quartet.id}
                    initialValues={{
                        id: quartet.id,
                        logo: undefined as File | undefined,
                        name: quartet.name,
                        biography: quartet.biography,
                        socials: quartet.socials,
                        members: quartet.members,
                        websiteUrl: quartet.websiteUrl ?? '',
                    }}
                    onSubmit={async ({ id, name, biography, socials, members, websiteUrl, logo }, { resetForm, setFieldError }) => {
                        const newQuartet = await editQuartet({ previousId: quartet.id, newId: id, name, biography, socials, members, websiteUrl: websiteUrl || null });

                        if (logo) {
                            await upload(logo.name, logo, {
                                access: 'public',
                                handleUploadUrl: '/api/quartet-logo',
                                clientPayload: newQuartet.id,
                            }).catch((e) => {
                                resetForm();
                                setFieldError('logo', e.toString());
                            });
                        }

                        await revalidate();

                        window.alert(`Quartet ${quartet.id} updated`);

                        await refetch();

                        resetForm();
                    }}
                    validationSchema={QuartetSchema}
                >
                    {({ submitForm, errors, dirty, values }) => (
                        <div className="flex flex-col items-center gap-3 rounded-md bg-slate-900 p-5">
                            <Field name="id" />{errors.id}
                            <Field name="name" />{errors.name}
                            <Field as="textarea" name="biography" />{errors.biography}
                            <Field name="members.tenor" />
                            <Field name="members.lead" />
                            <Field name="members.baritone" />
                            <Field name="members.bass" />
                            {Object.keys(values.socials).map((key) => (
                                <NullableTextField name={`socials.${key}`} />
                            ))}
                            <Field name="websiteUrl" />
                            <ImageUpload
                                name="logo"
                                existingImageUrl={quartet.logoUrl ?? undefined}
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
                                        <span className="absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 opacity-0 duration-200 group-hover:opacity-100">Change Logo</span>
                                    </button>
                                )}
                            </ImageUpload>
                            {dirty && <button onClick={submitForm} type="button">Save</button>}
                            <button
                                type="button"
                                onClick={async () => {
                                    await deleteQuartet(quartet.id);

                                    await revalidate();

                                    await refetch();
                                }}
                            >
                                Delete Quartet
                            </button>
                        </div>
                    )}
                </Formik>
            ))}
            <button
                type="button"
                onClick={async () => {
                    await createQuartet({
                        id: 'new-quartet',
                        name: 'A new quartet',
                        biography: 'The newest quartet in town',
                        members: { tenor: 'Unknown', lead: 'Unknown', baritone: 'Unknown', bass: 'Unknown' },
                        socials: {
                            x: null,
                            facebook: null,
                            instagram: null,
                            youtube: null,
                        },
                    });

                    await refetch();

                    await revalidate();
                }}
            >
                New Quartet
            </button>

        </div>
    );
}
