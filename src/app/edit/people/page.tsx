'use client';

import { trpc } from '@/common/trpc';
import { ImageUpload } from '@/components/ImageUpload';
import { Field, FieldArray, Formik } from 'formik';
import { upload } from '@vercel/blob/client';
import * as yup from 'yup';
import { ChorusId, PersonChorus } from '@prisma/client';
import revalidate from '../revalidate';

const UrlCompliant = /^[\w-]*$/;

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
    id: yup
        .string()
        .min(2)
        .max(30)
        .matches(UrlCompliant, 'Must not contain special characters')
        .required(),

    choruses: yup.array(yup.object().shape({
        chorusId: yup.mixed<ChorusId>().oneOf(Object.values(ChorusId)).required(),

        role: yup.string().min(2).max(30).required(),
    })),
});

type PersonChorusData = Omit<PersonChorus, 'personId'>;

export default function EditPeople() {
    const [people, { refetch }] = trpc.react.people.allPeople.useSuspenseQuery();

    const { mutateAsync: deletePerson } = trpc.react.people.deletePerson.useMutation();

    const { mutateAsync: editPerson } = trpc.react.people.editPerson.useMutation();

    const { mutateAsync: createPerson } = trpc.react.people.createPerson.useMutation();

    return (
        <div className="flex flex-row gap-5">
            {people.map((person) => (
                <Formik
                    initialValues={{
                        icon: undefined as File | undefined,
                        id: person.id,
                        name: person.name,
                        biography: person.biography,
                        choruses: person.choruses.map(({ chorusId, role }) => ({ chorusId, role } satisfies PersonChorusData)),
                    }}
                    onSubmit={async ({ icon, id, name, biography, choruses }, { setFieldError, resetForm }) => {
                        const newPerson = await editPerson({ previousId: person.id, newId: id, biography, name, choruses });

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

                        await revalidate();

                        window.alert(`Person ${name} updated`);
                    }}
                    validationSchema={PersonSchema}
                >
                    {({ submitForm, errors, values, dirty }) => (
                        <div className="flex flex-col items-center gap-3 rounded-md bg-slate-900 p-5">
                            <Field name="name" />{errors.name}
                            <Field name="id" />{errors.id}
                            <Field as="textarea" name="biography" />{errors.biography}
                            <FieldArray
                                name="choruses"
                            >
                                {({ remove, push }) => (
                                    <div>
                                        {values.choruses.map((chorus, index) => (
                                            <div key={chorus.chorusId} className="flex flex-row gap-3">
                                                <Field as="select" name={`choruses.${index}.chorusId`}>
                                                    {Object.keys(ChorusId).map((id) => (
                                                        <option value={id}>{id}</option>
                                                    ))}
                                                </Field>
                                                <Field name={`choruses.${index}.role`} />
                                                <button type="button" onClick={() => remove(index)}>Remove</button>
                                            </div>
                                        ))}
                                        {values.choruses.length < Object.keys(ChorusId).length
                                            && (
                                                <button
                                                    onClick={() => push({
                                                        chorusId: Object.keys(ChorusId).filter((id) => !values.choruses.find((chorus) => chorus.chorusId === id))[0] as ChorusId,
                                                        role: '',
                                                    } satisfies PersonChorusData)}
                                                    type="button"
                                                >Add Chorus
                                                </button>
                                            )}
                                    </div>
                                )}
                            </FieldArray>
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
                            {dirty && <button onClick={submitForm} type="button">Save</button>}
                            <button
                                type="button"
                                onClick={async () => {
                                    await deletePerson(person.id);

                                    await refetch();

                                    await revalidate();
                                }}
                            >Delete Person
                            </button>
                        </div>
                    )}
                </Formik>
            ))}
            <button
                type="button"
                onClick={async () => {
                    await createPerson({ biography: 'John Smith was a human identity the Tenth Doctor assumed while hiding from the Family of Blood.', name: 'John Smith' });

                    await refetch();

                    await revalidate();
                }}
            >New Person
            </button>
        </div>
    );
}
