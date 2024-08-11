'use client';

import { trpc } from '@/common/trpc';
import { Field, Formik } from 'formik';
import * as yup from 'yup';
import { ChorusId } from '@prisma/client';
import { DateTimeField } from '@/components/DateTimeField';
import revalidate from '../revalidate';

const EventSchema = yup.object().shape({
    name: yup
        .string()
        .min(3)
        .max(30)
        .required(),
    description: yup
        .string()
        .min(10)
        .max(150)
        .required(),
    address: yup
        .string()
        .min(3)
        .max(100)
        .required(),

    time: yup.date().required(),

    choruses: yup.array(yup.mixed<ChorusId>().oneOf(Object.values(ChorusId)).required()),
});

export default function EditEvents() {
    const [events, { refetch }] = trpc.react.events.allEvents.useSuspenseQuery();

    const { mutateAsync: deleteEvent } = trpc.react.events.deleteEvent.useMutation();

    const { mutateAsync: editEvent } = trpc.react.events.editEvent.useMutation();

    const { mutateAsync: createEvent } = trpc.react.events.createEvent.useMutation();

    return (
        <div className="flex flex-row gap-5">
            {events.map((event) => (
                <Formik
                    key={event.id}
                    initialValues={{
                        name: event.name,
                        description: event.description,
                        address: event.address,
                        time: event.time,
                        choruses: event.choruses.map(({ id }) => id),
                    }}
                    onSubmit={async ({ name, description, choruses, address, time }) => {
                        await editEvent({ id: event.id, description, name, choruses, address, time });

                        await revalidate();

                        window.alert(`Event ${name} updated`);
                    }}
                    validationSchema={EventSchema}
                >
                    {({ submitForm, errors, dirty }) => (
                        <div className="flex flex-col items-center gap-3 rounded-md bg-slate-900 p-5">
                            <Field name="name" />{errors.name}
                            <Field name="address" />{errors.address}
                            <Field as="textarea" name="description" />{errors.description}
                            <DateTimeField name="time" />
                            {Object.keys(ChorusId).map((id) => (
                                <label htmlFor={`chorus.${id}`} key={id}>
                                    <Field type="checkbox" id={`chorus.${id}`} name="choruses" value={id} />
                                    {id}
                                </label>
                            ))}
                            {errors.choruses}
                            {dirty && <button onClick={submitForm} type="button">Save</button>}
                            <button
                                type="button"
                                onClick={async () => {
                                    await deleteEvent(event.id);

                                    await refetch();

                                    await revalidate();
                                }}
                            >Delete Event
                            </button>
                        </div>
                    )}
                </Formik>
            ))}
            <button
                type="button"
                onClick={async () => {
                    await createEvent({ description: 'A new Harmony Waitaha Event', name: 'Concert Probably', address: 'Upper Riccarton Methodist Church', time: new Date() });

                    await refetch();

                    await revalidate();
                }}
            >New Event
            </button>
        </div>
    );
}
